package model

type Bet struct {
	UserID uint64  `json:"user_id"`
	RaceID uint64  `json:"race_id"`
	First  *string `json:"first"`
	Second *string `json:"second"`
	Third  *string `json:"third"`
}

func PlaceUserBet(bet *Bet) error {
	statement := `insert into bets (race_id, user_id, first, second, third) values ($1, $2, $3, $4, $5);`

	_, err := db.Exec(statement, bet.RaceID, bet.UserID, bet.First, bet.Second, bet.Third)
	return err

}

func GetAllBets() ([]Bet, error) {
	var bets []Bet
	statement := `select user_id, race_id, first, second, third from bets;`

	rows, err := db.Query(statement)
	if err != nil {
		return []Bet{}, err
	}

	for rows.Next() {
		var bet Bet
		err = rows.Scan(&bet.UserID, &bet.RaceID, &bet.First, &bet.Second, &bet.Third)
		if err != nil {
			return []Bet{}, err
		}
		bets = append(bets, bet)
	}

	return bets, nil
}

func GetBetById(id string) (Bet, error) {
	var bet Bet
	statement := `select user_id, race_id, first, second, third from bets where bet_id=$1;`

	rows, err := db.Query(statement, id)
	if err != nil {
		return Bet{}, err
	}

	for rows.Next() {
		err = rows.Scan(&bet.UserID, &bet.RaceID, &bet.First, &bet.Second, &bet.Third)
		if err != nil {
			return Bet{}, err
		}
	}

	return bet, nil

}
