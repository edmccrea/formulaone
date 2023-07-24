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

	router.Get("/race", GetRaceById)
	router.Get("/races", GetAllRaces)

	router.Post("/bet", PlaceUserBet)

	router.Listen(":8080")
}
