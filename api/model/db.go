package model

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

func Setup() {
	var err error
	err = godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	databaseURL := os.Getenv("DATABASE_URL")
	connStr := databaseURL
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
