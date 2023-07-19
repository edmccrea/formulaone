package model

type User struct {
	ID       uint64 `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func CreateUser(user *User) error {
	statement := `insert into users (username, password) values ($1, $2);`

	_, err := db.Exec(statement, user.Username, user.Password)
	return err
}

func GetUser(id string) (User, error) {
	var user User
	statement := `select * from users where id=$1;`

	rows, err := db.Query(statement, id)
	if err != nil {
		return User{}, err
	}

	for rows.Next() {
		err = rows.Scan(&user.ID, &user.Username, &user.Password)
		if err != nil {
			return User{}, err
		}
	}

	return user, nil

}

func GetAllUsers() ([]User, error) {
	var users []User
	statement := `select * from users;`

	rows, err := db.Query(statement)
	if err != nil {
		return []User{}, err
	}

	for rows.Next() {
		var user User
		err = rows.Scan(&user.ID, &user.Username, &user.Password)
		if err != nil {
			return []User{}, err
		}
		users = append(users, user)
	}

	return users, nil
}

func CheckUsername(username string, user *User) bool {
	statement := `select id, username, password from users where username=$1 limit 1;`

	rows, err := db.Query(statement, username)
	if err != nil {
		return false
	}

	for rows.Next() {
		err = rows.Scan(&user.ID, &user.Username, &user.Password)
		if err != nil {
			return false
		}
	}

	return true
}
