@echo off

:: ����REACT�M��, ���P�_��e�u�@�ؿ��ϧ_�t��node_modules
if exist node_modules (
echo ��e�u�@�ؿ��w��node_modules
) else (
echo node_modules ���s�b, �ϥ�7z�����Y...
"c:\program files\7-zip\7z.exe" -y x ".\jenkins_tool\node_modules.7z"
)

:: �ƻs�������Ҫ��]�w��(�]�w��~homepage)
echo �ƻs%1���Ҫ��]�w��(�]�wwebView��~homepage, api url)
xcopy ".\jenkins_tool\package-%1.json" ".\package.json" /y
xcopy ".\jenkins_tool\.env-%1" ".\.env" /y

:: �P�_��e�u�@�ؿ��ϧ_�t��node������
if exist node (
echo ��e�u�@�ؿ��w�t��node������
) else (
echo ��e�u�@�ؿ��S��node������, �ϥ�7z�����Y
"c:\program files\7-zip\7z.exe" -y x ".\jenkins_tool\node.7z"
)

:: �P�_��e�u�@�ؿ��ϧ_�t��maven������
if exist apache-maven-3.8.1 (
echo ��e�u�@�ؿ��w�t��maven������, �}�l����%1�]��...
".\jenkins_tool\mavenBuild.bat" %1
) else (
echo ��e�u�@�ؿ��S��maven������, �ϥ�7z�����Y�ö}�l����%1�]��...
"c:\program files\7-zip\7z.exe" -y x ".\jenkins_tool\maven_for_react.7z" & ".\jenkins_tool\mavenBuild.bat" %1
)