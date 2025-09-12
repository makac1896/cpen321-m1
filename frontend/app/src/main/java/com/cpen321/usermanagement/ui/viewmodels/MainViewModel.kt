package com.cpen321.usermanagement.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.cpen321.usermanagement.data.remote.api.LyricsInterface
import com.cpen321.usermanagement.data.remote.api.RetrofitClient
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LyricsState(
    val isLoading: Boolean = false,
    val lyrics: String? = null,
    val error: String? = null,
    val artist: String = "",
    val songTitle: String = ""
)

data class MainUiState(
    val successMessage: String? = null,
    val lyricsState: LyricsState = LyricsState()
)

@HiltViewModel
class MainViewModel @Inject constructor() : ViewModel() {

    private val _uiState = MutableStateFlow(MainUiState(
        lyricsState = LyricsState(
            artist = "",
            songTitle = "",
            lyrics = ""
        )
    ))
    val uiState: StateFlow<MainUiState> = _uiState.asStateFlow()
    
    private val lyricsInterface = RetrofitClient.lyricsInterface

    fun setSuccessMessage(message: String) {
        _uiState.value = _uiState.value.copy(successMessage = message)
    }

    fun clearSuccessMessage() {
        _uiState.value = _uiState.value.copy(successMessage = null)
    }
    
    fun updateArtist(artist: String) {
        _uiState.value = _uiState.value.copy(
            lyricsState = _uiState.value.lyricsState.copy(artist = artist)
        )
    }
    
    fun updateSongTitle(title: String) {
        _uiState.value = _uiState.value.copy(
            lyricsState = _uiState.value.lyricsState.copy(songTitle = title)
        )
    }
    
    fun searchLyrics() {
        val artist = _uiState.value.lyricsState.artist
        val songTitle = _uiState.value.lyricsState.songTitle
        
        if (artist.isBlank() || songTitle.isBlank()) {
            _uiState.value = _uiState.value.copy(
                lyricsState = _uiState.value.lyricsState.copy(
                    error = "Please enter both artist and song title",
                    isLoading = false
                )
            )
            return
        }
        
        if (artist == "Demo Artist" && songTitle == "Hobby Song") {
            _uiState.value = _uiState.value.copy(
                lyricsState = _uiState.value.lyricsState.copy(
                    lyrics = getSampleLyrics(),
                    isLoading = false,
                    error = null
                )
            )
            return
        }
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                lyricsState = _uiState.value.lyricsState.copy(
                    isLoading = true,
                    error = null,
                    lyrics = null
                )
            )
            
            try {
                val response = lyricsInterface.getLyrics(artist, songTitle)
                if (response.isSuccessful) {
                    val apiResponse = response.body()
                    if (apiResponse != null && apiResponse.data != null) {
                        _uiState.value = _uiState.value.copy(
                            lyricsState = _uiState.value.lyricsState.copy(
                                lyrics = apiResponse.data.lyrics,
                                isLoading = false,
                                error = null
                            )
                        )
                    } else {
                        // Create a more compact error message for 404 responses
                        val errorMessage = if (apiResponse?.error?.contains("not found") == true || 
                                              apiResponse?.message?.contains("not found") == true) {
                            "No lyrics found"
                        } else {
                            apiResponse?.error ?: "Lyrics not found"
                        }
                        
                        _uiState.value = _uiState.value.copy(
                            lyricsState = _uiState.value.lyricsState.copy(
                                error = errorMessage,
                                isLoading = false
                            )
                        )
                    }
                } else {
                    // Handle different error codes with more compact messages
                    val errorMessage = when (response.code()) {
                        404 -> "No lyrics found"
                        429 -> "API limit reached, try later"
                        in 500..599 -> "Server error, try later"
                        else -> "Error: ${response.code()}"
                    }
                    
                    _uiState.value = _uiState.value.copy(
                        lyricsState = _uiState.value.lyricsState.copy(
                            error = errorMessage,
                            isLoading = false
                        )
                    )
                }
            } catch (e: Exception) {
                // Create a more compact network error message
                val errorMessage = "Network error: Check connection"
                
                _uiState.value = _uiState.value.copy(
                    lyricsState = _uiState.value.lyricsState.copy(
                        error = errorMessage,
                        isLoading = false
                    )
                )
            }
        }
    }
    
    fun clearLyrics() {
        _uiState.value = _uiState.value.copy(
            lyricsState = _uiState.value.lyricsState.copy(
                lyrics = null,
                error = null
            )
        )
    }
    
    private fun getSampleLyrics(): String {
        return """
            Verse 1:
            Finding joy in what I do
            Each hobby brings something new
            Time flies by when I'm engaged
            In activities that aren't staged
            
            Chorus:
            My hobbies, my hobbies
            They bring color to my days
            My hobbies, my hobbies
            In so many different ways
            
            Verse 2:
            Sometimes painting, sometimes running
            Learning skills that can be stunning
            Growth and passion intertwine
            Making everyday life shine
            
            [Repeat Chorus]
            
            Bridge:
            When life gets too heavy
            And work becomes a chore
            I turn to my pastimes
            To find my joy once more
            
            Verse 3:
            Everyone needs something special
            Activities that are essential
            For mental health and for the soul
            Hobbies help to make us whole
            
            [Repeat Chorus]
            
            Outro:
            My hobbies...
            They bring meaning to my days
        """.trimIndent()
    }
}
