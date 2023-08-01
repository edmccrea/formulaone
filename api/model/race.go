package model

type Race struct {
	ID              uint64  `json:"race_id"`
	RaceName        *string `json:"race_name"`
	RaceType        *string `json:"race_type"`
	CountryFlag     *string `json:"country_flag"`
	QualifyingStart *string `json:"qualifying_start"`
	Location        *string `json:"location"`
	TrackName       *string `json:"track_name"`
	RaceStart       *string `json:"race_start"`
	RaceImage       *string `json:"race_image"`
}

func CreateRace(user *User) error {
	statement := `insert into users (username, password) values ($1, $2);`

	_, err := db.Exec(statement, user.Username, user.Password)
	return err
}

func GetRaceById(id string) (Race, error) {
	var race Race
	statement := `select * from races where race_id=$1;`

	rows, err := db.Query(statement, id)
	if err != nil {
		return Race{}, err
	}

	for rows.Next() {
		err = rows.Scan(&race.ID, &race.RaceName, &race.RaceType, &race.CountryFlag, &race.QualifyingStart, &race.Location, &race.TrackName, &race.RaceStart, &race.RaceImage)
		if err != nil {
			return Race{}, err
		}
	}

	return race, nil

}

func GetAllRaces() ([]Race, error) {
	var races []Race
	statement := `select * from races;`

	rows, err := db.Query(statement)
	if err != nil {
		return []Race{}, err
	}

	for rows.Next() {
		var race Race
		err = rows.Scan(&race.ID, &race.RaceName, &race.RaceType, &race.CountryFlag, &race.QualifyingStart, &race.Location, &race.TrackName, &race.RaceStart, &race.RaceImage)
		if err != nil {
			return []Race{}, err
		}
		races = append(races, race)
	}

	return races, nil
}
