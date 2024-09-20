; Script AutoHotKey pour déconnecter NordVPN

Run, "C:\Program Files\NordVPN\NordVPN.exe"
Sleep, 2000 ; Attendre que l'application se lance

; 
Send, disconnect{Enter} ;
Sleep, 5000 ;

ExitApp
