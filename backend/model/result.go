package model

type Result struct {
	RaceID uint64  `json:"race_id"`
	First  *string `json:"first"`
	Second *string `json:"second"`
	Third  *string `json:"third"`
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
