package com.cpen321.usermanagement.data.remote.dto

data class UserDto(
    val id: String,
    val name: String,
    val email: String,
    val profilePicture: String? = null,
    val hobbies: List<String> = emptyList()
)
