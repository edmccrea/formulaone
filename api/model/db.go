package model

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

func setEnvironment() {
	hostname, err := os.Hostname()
	if err != nil {
		fmt.Println("Error getting hostname:", err)
		return
	}

	fmt.Println("Hostname:", hostname)

	// Set environment variables based on hostname or other conditions
	switch hostname {
	case "MacBook-Pro.local":
		os.Setenv("ENV", "dev")
		os.Setenv("DATABASE_URL", "user=edmccrea dbname=formulaone sslmode=disable")
	case "production-machine":
		os.Setenv("ENV", "prod")
	default:
		os.Setenv("ENV", "unknown")
	}
	fmt.Println("ENV:", os.Getenv("ENV"))
	fmt.Println("DATABASE_URL:", os.Getenv("DATABASE_URL"))
}

var db *sql.DB

func Setup() {
	setEnvironment()

	var err error
	dbUrl := os.Getenv("DATABASE_URL")
	connStr := dbUrl

	db, err = sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}

	pingErr := db.Ping()
	if pingErr != nil {
		fmt.Println(err)
	}
	fmt.Println("Database Connected!")
}
