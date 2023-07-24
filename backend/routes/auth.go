package routes

import (
	"fmt"
	"formulaone/model"
	"strings"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type user struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type bet struct {
	BetID  uint64  `json:"bet_id"`
	UserID uint64  `json:"user_id"`
	RaceID uint64  `json:"race_id"`
	First  *string `json:"first"`
	Second *string `json:"second"`
	Third  *string `json:"third"`
}

func NewMiddleware() fiber.Handler {
	return AuthMiddleware
}

func AuthMiddleware(c *fiber.Ctx) error {
	sess, err := store.Get(c)

	if strings.Split(c.Path(), "/")[1] == "auth" {
		return c.Next()
	}

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	if sess.Get(AUTH_KEY) == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized: auth key is nil",
		})
	}

	return c.Next()
}

func Register(c *fiber.Ctx) error {
	c.Accepts("application/json")
	var data user

	err := c.BodyParser(&data)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong" + err.Error(),
		})
	}

	password, bcErr := bcrypt.GenerateFromPassword([]byte(data.Password), 14)

	if bcErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "something went wrong" + bcErr.Error(),
		})
	}

	user := model.User{
		Username: data.Username,
		Password: string(password),
	}

	err = model.CreateUser(&user)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong" + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "user created",
	})
}

func Login(c *fiber.Ctx) error {
	var data user

	err := c.BodyParser(&data)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong" + err.Error(),
		})
	}

	var user model.User
	if !model.CheckUsername(data.Username, &user) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized. couldn't find user",
		})
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized. incorrect password",
		})
	}

	sess, err := store.Get(c)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "something went wrong:" + err.Error(),
		})
	}

	sess.Set(AUTH_KEY, true)
	sess.Set(USER_ID, user.ID)

	sessErr := sess.Save()

	if sessErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "something went wrong:" + sessErr.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "logged in",
	})
}

func Logout(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "logged out (no session)",
		})
	}

	err = sess.Destroy()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "something went wrong:" + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "logged out",
	})
}

func GetUser(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	userId := sess.Get(USER_ID)
	if userId == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	var user model.User
	user, err = model.GetUser(fmt.Sprint(userId))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	user.Password = ""

	return c.Status(fiber.StatusOK).JSON(user)
}

func GetAllUsers(c *fiber.Ctx) error {
	users, err := model.GetAllUsers()
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized: " + err.Error(),
		})
	}

	for i := range users {
		users[i].Password = ""
	}

	return c.Status(fiber.StatusOK).JSON(users)
}
