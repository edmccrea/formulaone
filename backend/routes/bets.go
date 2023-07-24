package routes

import (
	"fmt"
	"formulaone/model"
	"strconv"

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

func GetAllBets(c *fiber.Ctx) error {
	bets, err := model.GetAllBets()
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "something went wrong " + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(bets)

}

func GetBetById(c *fiber.Ctx) error {
	betId, _ := strconv.ParseInt(c.Params("id"), 10, 64)
	var bet model.Bet
	bet, err := model.GetBetById(fmt.Sprint(betId))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "something went wrong " + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(bet)
}
