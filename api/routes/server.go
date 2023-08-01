package routes

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/session"
)

var (
	store    *session.Store
	AUTH_KEY string = "authenticated"
	USER_ID  string = "user_id"
)

func Setup() {

	router := fiber.New()

	store = session.New(session.Config{
		CookieHTTPOnly: true,
		// CookieDomain:   "localhost",
		// CookieSameSite: "none",
		CookieSecure: true,
		Expiration:   time.Hour * 24 * 7,
	})

	router.Use(NewMiddleware(), cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "http://localhost:5173",
		AllowHeaders:     "Access-Control-Allow-Origin, Content-Type, Origin, Accept",
	}))

	router.Post("/auth/register", Register)
	router.Post("/auth/login", Login)
	router.Post("/auth/logout", Logout)

	router.Get("/user", GetUser)
	router.Get("/users", GetAllUsers)
	router.Get("/users/:id", GetUserById)

	router.Get("/races", GetAllRaces)
	router.Get("/races/:id", GetRaceById)

	router.Get("/bets", GetAllBets)
	router.Get("/bets/:id", GetBetById)
	router.Get("/bets/race/:id", GetBetsByRaceId)
	router.Get("/bets/user/:id", GetBetsByUserId)
	router.Post("/bets", PlaceUserBet)

	// TODO - move these under one route
	router.Get("/results", GetAllResults)
	router.Get("/results/:raceId", GetResultByRaceId)
	router.Post("/results", PostResult)

	router.Listen(":8080")
}