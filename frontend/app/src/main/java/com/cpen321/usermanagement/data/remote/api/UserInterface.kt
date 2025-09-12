package com.cpen321.usermanagement.data.remote.api

import com.cpen321.usermanagement.data.remote.dto.ApiResponse
import com.cpen321.usermanagement.data.remote.dto.UserDto
import retrofit2.Response
import retrofit2.http.*

interface UserInterface {
    @GET("user/profile")
    suspend fun getUserProfile(): Response<ApiResponse<UserDto>>

    @PUT("user/profile")
    suspend fun updateUserProfile(@Body userProfile: UserDto): Response<ApiResponse<UserDto>>
}
