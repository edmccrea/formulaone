package routes

import (
	"formulaone/model"

	"github.com/gofiber/fiber/v2"
)

func PlaceUserBet(c *fiber.Ctx) error {
	c.Accepts("application/json")

	var data bet

	err := c.BodyParser(&data)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong" + err.Error(),
		})
	}

	//TODO: get user is dynamically
	bet := model.Bet{
		RaceID: data.RaceID,
		UserID: data.UserID,
		First:  data.First,
		Second: data.Second,
		Third:  data.Third,
	}

	err = model.PlaceUserBet(&bet)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong" + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "bet placed",
	})

}
