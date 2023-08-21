package main

import (
	"fmt"
	"log"
	"net/http"
	"tdic/model"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Key    string `gorm:"column:key"`
	Wallet string `gorm:"column:wallet"`
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

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"} // Replace with your allowed origin(s)
	config.AllowHeaders = []string{"Authorization", "Content-Type"}

	r.Use(cors.New(config))

	r.POST("/users", func(c *gin.Context) {
		var userReq model.UserRequest
		if err := c.ShouldBindJSON(&userReq); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// Check if the wallet already exists in the database
		var existingUser User
		result := db.Where("wallet = ?", userReq.Wallet).First(&existingUser)
		if result.RowsAffected > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Wallet already exists"})
			return
		}

		user := &User{
			Key:    userReq.Key,
			Wallet: userReq.Wallet,
		}
		err := db.Create(&user)
		if err.Error != nil {
			c.JSON(500, gin.H{"error": result.Error.Error()})
			return
		}

		c.JSON(200, userReq)
	})

	r.GET("/users/:wallet", func(c *gin.Context) {
		var user User
		wallet := c.Param("wallet")
		fmt.Println(wallet)
		result := db.Where("wallet = ?", wallet).First(&user)
		fmt.Println(result)
		if result.Error != nil {
			fmt.Println("error")
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		response := &model.UserResponse{
			Key: user.Key,
		}
		c.JSON(200, response)
	})

	r.DELETE("/users/:wallet", func(c *gin.Context) {
		wallet := c.Param("wallet")

		// Find the user by their wallet value
		var user User
		context := wallet
		fmt.Println("wallet :", context)
		if err := db.Where("wallet = ?", wallet).First(&user).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		// Delete the user from the database
		if err := db.Delete(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
	})

	r.Run(":8080") // Run the server on port 8080
}
