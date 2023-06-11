package main

import (
	"cloud.google.com/go/civil"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httputil"
	"time"
)

type OverblijfReq struct {
	Parents []Parent
	Days    []time.Time
}

func main() {

	//http.HandleFunc("/", handlePost())
	//
	//log.Fatal(http.ListenAndServe(":8080", nil))
	OptimalMatches(getDates(), getParents())
}

func handlePost() func(writer http.ResponseWriter, request *http.Request) {
	return func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Content-Type", "application/json")
		reqDump, _ := httputil.DumpRequest(request, true)
		fmt.Println(string(reqDump))

		var overblijfReq OverblijfReq
		err := json.NewDecoder(request.Body).Decode(&overblijfReq)
		fmt.Printf("Decoded %s \n", overblijfReq)

		if err != nil {
			fmt.Printf("Error decoding!! %s", err)
			_, err = fmt.Fprintf(writer, err.Error())
			return
		}

		if len(overblijfReq.Parents) == 0 || len(overblijfReq.Days) == 0 {
			fmt.Println("Empty days or parents")
			http.Error(writer, "no days or parents", 403)
			return
		}

		matches := OptimalMatches(overblijfReq.Days, overblijfReq.Parents)
		err = json.NewEncoder(writer).Encode(matches)
		if err != nil {
			fmt.Print(err)
			_, err = fmt.Fprintf(writer, "Hello World")
			fmt.Print(err)
			return
		}
	}
}

func getParents() []Parent {
	return []Parent{
		{"Amelie Ahmead", []time.Weekday{time.Monday}},
		{"Anika Varlamov", []time.Weekday{}},
		{"Chimène Ajaiso", []time.Weekday{time.Monday, time.Thursday}},
		{"Elio Monteferrante", []time.Weekday{}},
		{"Jemayrio Bacuna", []time.Weekday{}},
		{"Noah-Jaxx Knipscheer", []time.Weekday{time.Monday}},
		{"Normani Martodikromo", []time.Weekday{}},
		{"Nousha Nikkhah", []time.Weekday{}},
		{"Roan Zorge", []time.Weekday{}},
		{"Robin Vis", []time.Weekday{}},
		{"Sem Bentvelzen", []time.Weekday{}},
		{"Sophia van der Poel", []time.Weekday{}},
		{"Victoria Barone", []time.Weekday{time.Monday, time.Thursday}},
		{"Zoya Tariq", []time.Weekday{time.Tuesday, time.Thursday}},
		{"Trichayra Ramjiawan", []time.Weekday{}},
	}
}

func getDates() []time.Time {
	return []time.Time{
		civil.Date{Year: 2023, Month: 8, Day: 21}.In(time.UTC),
		civil.Date{Year: 2023, Month: 8, Day: 22}.In(time.UTC),
		civil.Date{Year: 2023, Month: 8, Day: 24}.In(time.UTC),
		civil.Date{Year: 2023, Month: 8, Day: 28}.In(time.UTC),
		civil.Date{Year: 2023, Month: 8, Day: 29}.In(time.UTC),
		civil.Date{Year: 2023, Month: 8, Day: 31}.In(time.UTC),
		civil.Date{Year: 2023, Month: 9, Day: 4}.In(time.UTC),
		civil.Date{Year: 2023, Month: 9, Day: 5}.In(time.UTC),
		civil.Date{Year: 2023, Month: 9, Day: 7}.In(time.UTC),
		civil.Date{Year: 2023, Month: 9, Day: 11}.In(time.UTC),
		civil.Date{Year: 2023, Month: 9, Day: 12}.In(time.UTC),
		civil.Date{Year: 2023, Month: 9, Day: 14}.In(time.UTC),
		civil.Date{Year: 2023, Month: 9, Day: 18}.In(time.UTC),
		civil.Date{Year: 2023, Month: 9, Day: 21}.In(time.UTC),
		civil.Date{Year: 2023, Month: 9, Day: 25}.In(time.UTC),
		civil.Date{Year: 2023, Month: 9, Day: 26}.In(time.UTC),
		civil.Date{Year: 2023, Month: 9, Day: 28}.In(time.UTC),
	}
}
