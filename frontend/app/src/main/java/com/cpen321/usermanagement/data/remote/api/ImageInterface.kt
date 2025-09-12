package com.cpen321.usermanagement.data.remote.api

import com.cpen321.usermanagement.data.remote.dto.ApiResponse
import okhttp3.MultipartBody
import retrofit2.Response
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part

interface ImageInterface {
    @Multipart
    @POST("media/upload")
    suspend fun uploadImage(@Part image: MultipartBody.Part): Response<ApiResponse<String>>
}
