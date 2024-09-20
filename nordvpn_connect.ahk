; Script AutoHotKey pour se connecter à un serveur spécifique NordVPN

Run, "C:\Program Files\NordVPN\NordVPN.exe"
Sleep, 2000 ;

;
Send, connect France{Enter} ;
Sleep, 5000 ; 

ExitApp
