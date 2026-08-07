class AuthResponse():

    def getSignupResponse():
        # {
        #     "username": "kobii",
        #     "email": "kobii@example.com",
        #     "password": "Password@123"
        # } Expected Request
        return({
            "success": True,
            "message": "Account created successfully.",
            "data": {
                "user": {
                    "id": "usr_01J5A7B8C9",
                    "username": "kobii",
                    "email": "kobii@example.com",
                    "avatar": None,
                    "role": "user",
                    "is_verified": True,
                    "created_at": "2026-08-07T10:30:00Z"
                },
                "access_token": "dummy_access_token_123456",
                "refresh_token": "dummy_refresh_token_123456"
            }
        })

    def getLoginResponse():
        # {
        #     "email": "kobii@example.com",
        #     "password": "Password@123"
        # } Expected Request
        return({
            "success": True,
            "message": "Login successful.",
            "data": {
                "user": {
                    "id": "usr_01J5A7B8C9",
                    "username": "kobii",
                    "email": "kobii@example.com",
                    "avatar": "https://dummyimage.com/200x200",
                    "role": "user"
                },
                "access_token": "dummy_access_token_123456",
                "refresh_token": "dummy_refresh_token_123456"
            }
        })

    def getMeResponse():
        return({
            "success": True,
            "data": {
                "id": "usr_01J5A7B8C9",
                "username": "kobii",
                "email": "kobii@example.com",
                "avatar": "https://dummyimage.com/200x200",
                "bio": "Backend Developer",
                "country": "India",
                "state": "Delhi",
                "city": "New Delhi",
                "role": "user",
                "is_verified": True,
                "created_at": "2026-08-07T10:30:00Z"
            }
        })