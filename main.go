package main

import (
	"cloud.google.com/go/civil"
	"fmt"
	"golang.org/x/exp/constraints"
	"golang.org/x/exp/slices"
	"time"
)

func min[T constraints.Ordered](a, b T) T {
	if a < b {
		return a
	}
	return b
}

type parent struct {
	Name        string
	Preferences []time.Weekday
}

func main() {
	matchedDates := matchDays(getDates())

	for t, p := range matchedDates {
		pref := len(p.Preferences) == 0 || slices.Contains(p.Preferences, t.Weekday())
		fmt.Printf("Matched parents %s to %s. This was %t their preference \n", p.Name, t.Format("Monday, 2006-01-02"), pref)
	}
}

func matchDays(remainingDates []time.Time) map[time.Time]parent {
	remLength := min(len(getParents()), len(remainingDates))
	dates := remainingDates[:remLength+1]
	remainingDates = remainingDates[remLength+1:]
	matchedDates := make(map[time.Time]parent, len(getDates()))
	for _, p := range getParents() {
		if len(p.Preferences) == 0 {
			matchedDates[dates[0]] = p
			dates = slices.Delete(dates, 0, 1)
		} else {
			for i := 0; i < len(dates); i++ {
				if slices.Contains(p.Preferences, dates[i].Weekday()) {
					matchedDates[dates[i]] = p
					dates = append(dates[:i], dates[i+1:]...)
					break
				} else if i == len(dates)-1 {
					matchedDates[dates[i]] = p
					dates = dates[:i+1]
				}
			}
		}
	}

	matchedDates = tradeDays(matchedDates)

	if len(remainingDates) > 0 {
		return mergeMap(matchedDates, matchDays(remainingDates))
	}
	return matchedDates
}

func tradeDays(dates map[time.Time]parent) map[time.Time]parent {
	for t, p := range dates {
		pref := len(p.Preferences) == 0 || slices.Contains(p.Preferences, t.Weekday())
		if !pref {
			for t2, p2 := range dates {
				if slices.Contains(p.Preferences, t2.Weekday()) &&
					p.Name != p2.Name &&
					(len(p2.Preferences) == 0 || slices.Contains(p2.Preferences, t.Weekday())) {
					fmt.Printf("Swapping dates %s and %s between %s and %s \n", t.Format("Monday, 2006-01-02"), t2.Format("Monday, 2006-01-02"), p.Name, p2.Name)
					dates[t] = p2
					dates[t2] = p
				}
			}
		}
	}
	return dates
}

func getParents() []parent {
	return []parent{
		{"A", []time.Weekday{time.Monday, time.Tuesday}},
		{"B", []time.Weekday{time.Monday}},
		{"C", []time.Weekday{time.Monday, time.Tuesday, time.Thursday}},
		{"D", []time.Weekday{}},
		{"E", []time.Weekday{time.Tuesday}},
		{"F", []time.Weekday{time.Monday}},
		{"G", []time.Weekday{time.Tuesday}},
	}
}

func getDates() []time.Time {
	return []time.Time{
		civil.Date{Year: 2023, Month: 6, Day: 1}.In(time.UTC),
		civil.Date{Year: 2023, Month: 6, Day: 5}.In(time.UTC),
		civil.Date{Year: 2023, Month: 6, Day: 6}.In(time.UTC),
		civil.Date{Year: 2023, Month: 6, Day: 8}.In(time.UTC),
		civil.Date{Year: 2023, Month: 6, Day: 12}.In(time.UTC),
		civil.Date{Year: 2023, Month: 6, Day: 13}.In(time.UTC),
		civil.Date{Year: 2023, Month: 6, Day: 15}.In(time.UTC),
		civil.Date{Year: 2023, Month: 6, Day: 19}.In(time.UTC),
		civil.Date{Year: 2023, Month: 6, Day: 20}.In(time.UTC),
		civil.Date{Year: 2023, Month: 6, Day: 22}.In(time.UTC),
		civil.Date{Year: 2023, Month: 6, Day: 26}.In(time.UTC),
		civil.Date{Year: 2023, Month: 6, Day: 27}.In(time.UTC),
		civil.Date{Year: 2023, Month: 6, Day: 29}.In(time.UTC),
		civil.Date{Year: 2023, Month: 7, Day: 3}.In(time.UTC),
		civil.Date{Year: 2023, Month: 7, Day: 4}.In(time.UTC),
		civil.Date{Year: 2023, Month: 7, Day: 6}.In(time.UTC),
	}
}

func mergeMap(map1, map2 map[time.Time]parent) map[time.Time]parent {
	combined := map[time.Time]parent{}
	for k, v := range map1 {
		combined[k] = v
	}
	for k, v := range map2 {
		combined[k] = v
	}
	return combined
}
