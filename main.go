package main

import (
	"cloud.google.com/go/civil"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"time"
)

type OverblijfReq struct {
	Parents []Parent
	Days    []time.Time
}

func main() {

	http.HandleFunc("/", handlePost())

	log.Fatal(http.ListenAndServe(":8080", nil))
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
