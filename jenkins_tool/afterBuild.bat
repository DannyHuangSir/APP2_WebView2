@echo off
echo �ظm����!!�ƻswar�ɦ�compiler\%1\%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%
xcopy /s /i /y ".\target\*.war"  ".\compiler\%1\%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%"