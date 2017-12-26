# haiku

This app allows users to create haikus, line by line. If the correct number of syllables is reached for each line, the users are allowed to proceed to the next line and continue composing. After composing the entire haiku, they can submit the haiku for voting.

Delete and edit features have been created and disabled, so users cannot edit or delete entries by other users.

Users can vote by pressing "hai-5".

The "Merriam Websters' API was used. Responses are given in XML format.

'hai·koo' submits an GET request to the WORDS api after a user has entered text, and determines the number of syllables in a line. 
