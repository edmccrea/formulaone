package main

import (
	"formulaone/model"
	"formulaone/routes"
)

func main() {
	model.Setup()
	routes.Setup()
}
