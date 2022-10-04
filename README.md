# ft_transcendence_42
No more C! No more C++! This project is about doing something you’ve never done before. Remind yourself the beginning of your journey in computer science. Look at you now. Time to shine!



### Auth

* production:
	* @nestjs/passport 
	* @nestjs/jwt
	* @bcrypt
	* class-validator
	* class-transformer
	* passport
	* passport-jwt
	* passport-local

* dev 
	* @types/passport-jwt
	* @types/passport-local
	* @types/bcrypt


- global validation(validation pipe global)
```typescript
# main.ts
app.useGlobalPipes(
	new ValidationPipe({
		transform: true,
		whitelist: true,
		forbidNonWhitelisted: true
	})
)
```

