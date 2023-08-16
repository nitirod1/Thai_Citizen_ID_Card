package main

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	TokenId uint
	Key     string
}

func main() {
	dsn := "user=root dbname=db-tdic password=root host=0.0.0.0 port=5432"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	// Get the object instance of the database.
	dbase, err := db.DB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer dbase.Close()
	db.AutoMigrate(&User{})
	err = dbase.Ping()
	if err != nil {
		// Is there an error?
		panic(err.Error())
	}

	fmt.Println("Connection to database established.")
}
