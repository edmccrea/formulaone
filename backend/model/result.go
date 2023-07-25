package model

type Result struct {
	RaceID uint64  `json:"race_id"`
	First  *string `json:"first"`
	Second *string `json:"second"`
	Third  *string `json:"third"`
}

func GetAllResults() ([]Result, error) {
	var results []Result
	statement := `select * from results;`

	rows, err := db.Query(statement)
	if err != nil {
		return []Result{}, err
	}

	for rows.Next() {
		var result Result
		err = rows.Scan(&result.RaceID, &result.First, &result.Second, &result.Third)
		if err != nil {
			return []Result{}, err
		}
		results = append(results, result)
	}

	return results, nil
}

func GetResultByRaceId(id string) (Result, error) {
	var result Result
	statement := `select * from results where race_id=$1;`

	rows, err := db.Query(statement, id)
	if err != nil {
		return Result{}, err
	}

	for rows.Next() {
		err = rows.Scan(&result.RaceID, &result.First, &result.Second, &result.Third)
		if err != nil {
			return Result{}, err
		}
	}

	return result, nil

}

func PostResult(result *Result) error {
	statement := `insert into results (race_id, first, second, third) values ($1, $2, $3, $4);`

	_, err := db.Exec(statement, result.RaceID, result.First, result.Second, result.Third)
	return err

}
