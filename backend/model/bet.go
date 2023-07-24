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
