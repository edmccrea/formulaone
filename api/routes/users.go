package routes

import (
	"fmt"
	"formulaone/model"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

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

func GetUserById(c *fiber.Ctx) error {
	userId, _ := strconv.ParseInt(c.Params("id"), 10, 64)

	user, err := model.GetUser(fmt.Sprint(userId))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized: " + err.Error(),
		})
	}

	user.Password = ""

	return c.Status(fiber.StatusOK).JSON(user)
}
