package main

import (
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

type Parent struct {
	Name        string
	Preferences []time.Weekday
}

type MatchResult struct {
	Parent Parent
	Happy  bool
}

func OptimalMatches(days []time.Time, parents []Parent) map[time.Time]MatchResult {
	matchedDates := matchDays(days, parents)

	matchResult := make(map[time.Time]MatchResult)
	for t, p := range matchedDates {
		pref := len(p.Preferences) == 0 || slices.Contains(p.Preferences, t.Weekday())
		matchResult[t] = MatchResult{p, pref}
		fmt.Printf("Matched parents %s to %s. This was %t their preference \n", p.Name, t.Format("Monday, 2006-01-02"), pref)
	}

	return matchResult
}

func matchDays(allDates []time.Time, parents []Parent) map[time.Time]Parent {
	if len(allDates) == 0 {
		return map[time.Time]Parent{}
	}
	dates, remainingDates := splitArray(allDates, len(parents))
	matchedDates := make(map[time.Time]Parent, len(getDates()))
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
		return combineMap(matchedDates, matchDays(remainingDates, parents))
	}
	return matchedDates
}

func tradeDays(dates map[time.Time]Parent) map[time.Time]Parent {
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

func combineMap(map1, map2 map[time.Time]Parent) map[time.Time]Parent {
	combined := map[time.Time]Parent{}
	for k, v := range map1 {
		combined[k] = v
	}
	for k, v := range map2 {
		combined[k] = v
	}
	return combined
}

func splitArray(arr []time.Time, maxLen int) (left, right []time.Time) {
	lenArray := len(arr)
	remLength := min(maxLen, lenArray)
	left = arr[:remLength+1]
	right = []time.Time{}
	if remLength < lenArray {
		right = arr[remLength+1:]
	}
	return
}
