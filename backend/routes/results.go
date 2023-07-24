package routes

import (
	"fmt"
	"formulaone/model"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func GetResultByRaceId(c *fiber.Ctx) error {
	raceId, _ := strconv.ParseInt(c.Query("raceId"), 10, 64)
	var result model.Result
	result, err := model.GetResultByRaceId(fmt.Sprint(raceId))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "something went wrong " + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(result)

}
