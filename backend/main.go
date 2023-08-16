package main

import (
	"fmt"
	"log"
	"tdic/model"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	TokenId uint   `gorm:"column:token_id"`
	Key     string `gorm:"column:key"`
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

	r := gin.Default()

	r.POST("/users", func(c *gin.Context) {
		var userReq model.UserRequest
		if err := c.ShouldBindJSON(&userReq); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		user := &User{
			TokenId: userReq.TokenId,
			Key:     userReq.Key,
		}
		result := db.Create(&user)
		if result.Error != nil {
			c.JSON(500, gin.H{"error": result.Error.Error()})
			return
		}

		c.JSON(200, userReq)
	})

	r.GET("/users/:tokenId", func(c *gin.Context) {
		var user User
		tokenId := c.Param("tokenId")
		result := db.Where("token_id = ?", tokenId).First(&user)
		if result.Error != nil {
			c.JSON(404, gin.H{"error": "User not found"})
			return
		}

		response := &model.UserResponse{
			TokenId: user.TokenId,
			Key:     user.Key,
		}
		c.JSON(200, response)
	})

	r.Run(":8080") // Run the server on port 8080
}
