package routes

import (
	"fmt"
	"formulaone/model"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func GetRaceById(c *fiber.Ctx) error {
	raceId, _ := strconv.ParseInt(c.Params("id"), 10, 64)
	var race model.Race
	race, err := model.GetRaceById(fmt.Sprint(raceId))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "something went wrong " + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(race)
}

func GetAllRaces(c *fiber.Ctx) error {
	races, err := model.GetAllRaces()
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized: " + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(races)
}
