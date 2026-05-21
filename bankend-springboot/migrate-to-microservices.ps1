$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$srcJava = "$root\src\main\java\com\flittly\bankendspringboot"
$srcRes = "$root\src\main\resources"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GeoExplorer Microservice Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. DTOs
Write-Host "[1/7] Copying DTOs..." -ForegroundColor Yellow
$dir = "$root\bankend-common\src\main\java\com\flittly\bankendspringboot\dto"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
Copy-Item -Path "$srcJava\dto\*" -Destination $dir -Force
Write-Host "  Done" -ForegroundColor Green

# 2. Mapper interfaces
Write-Host "[2/7] Copying Mapper interfaces..." -ForegroundColor Yellow
$dir = "$root\bankend-common\src\main\java\com\flittly\bankendspringboot\mapper"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
Copy-Item -Path "$srcJava\mapper\*" -Destination $dir -Force
Write-Host "  Done" -ForegroundColor Green

# 3. Mapper XML
Write-Host "[3/7] Copying Mapper XML..." -ForegroundColor Yellow
$dir = "$root\bankend-common\src\main\resources\mapper"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
Copy-Item -Path "$srcRes\mapper\*" -Destination $dir -Force
Write-Host "  Done" -ForegroundColor Green

# 4. Config files (skip SecurityConfig, CorsConfig, WebMvcConfig)
Write-Host "[4/7] Copying config files..." -ForegroundColor Yellow
$dir = "$root\bankend-common\src\main\java\com\flittly\bankendspringboot\config"
$files = Get-ChildItem -Path "$srcJava\config" -File
foreach ($f in $files) {
    $skip = ($f.Name -eq "SecurityConfig.java") -or ($f.Name -eq "CorsConfig.java") -or ($f.Name -eq "WebMvcConfig.java")
    if (-not $skip) {
        Copy-Item -Path $f.FullName -Destination $dir -Force
    }
}
Write-Host "  Done" -ForegroundColor Green

# 5. auth-service controllers & services
Write-Host "[5/7] Copying auth-service..." -ForegroundColor Yellow
$ctrlDir = "$root\bankend-auth-service\src\main\java\com\flittly\bankendspringboot\controller"
$svcDir = "$root\bankend-auth-service\src\main\java\com\flittly\bankendspringboot\service"
New-Item -ItemType Directory -Force -Path $ctrlDir | Out-Null
New-Item -ItemType Directory -Force -Path $svcDir | Out-Null
Copy-Item -Path "$srcJava\controller\AuthController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\controller\AdminAuthController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\service\AuthService.java" -Destination $svcDir -Force
Write-Host "  Done" -ForegroundColor Green

# 6. user-service controllers & services
Write-Host "[6/7] Copying user-service..." -ForegroundColor Yellow
$ctrlDir = "$root\bankend-user-service\src\main\java\com\flittly\bankendspringboot\controller"
$svcDir = "$root\bankend-user-service\src\main\java\com\flittly\bankendspringboot\service"
New-Item -ItemType Directory -Force -Path $ctrlDir | Out-Null
New-Item -ItemType Directory -Force -Path $svcDir | Out-Null
Copy-Item -Path "$srcJava\controller\UserController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\controller\LevelController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\controller\QuestionController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\controller\MistakeController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\controller\TriviaController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\service\UserService.java" -Destination $svcDir -Force
Copy-Item -Path "$srcJava\service\LevelService.java" -Destination $svcDir -Force
Copy-Item -Path "$srcJava\service\QuestionService.java" -Destination $svcDir -Force
Copy-Item -Path "$srcJava\service\MistakeService.java" -Destination $svcDir -Force
Copy-Item -Path "$srcJava\service\TriviaService.java" -Destination $svcDir -Force
Write-Host "  Done" -ForegroundColor Green

# 7. content-service + geo-service
Write-Host "[7/7] Copying content-service & geo-service..." -ForegroundColor Yellow

$ctrlDir = "$root\bankend-content-service\src\main\java\com\flittly\bankendspringboot\controller"
$svcDir = "$root\bankend-content-service\src\main\java\com\flittly\bankendspringboot\service"
New-Item -ItemType Directory -Force -Path $ctrlDir | Out-Null
New-Item -ItemType Directory -Force -Path $svcDir | Out-Null
Copy-Item -Path "$srcJava\controller\PostController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\controller\AdminPostController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\controller\CommentController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\controller\LikeController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\controller\FavoriteController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\service\PostService.java" -Destination $svcDir -Force
Copy-Item -Path "$srcJava\service\CommentService.java" -Destination $svcDir -Force
Copy-Item -Path "$srcJava\service\LikeService.java" -Destination $svcDir -Force
Copy-Item -Path "$srcJava\service\FavoriteService.java" -Destination $svcDir -Force

$ctrlDir = "$root\bankend-geo-service\src\main\java\com\flittly\bankendspringboot\controller"
$svcDir = "$root\bankend-geo-service\src\main\java\com\flittly\bankendspringboot\service"
New-Item -ItemType Directory -Force -Path $ctrlDir | Out-Null
New-Item -ItemType Directory -Force -Path $svcDir | Out-Null
Copy-Item -Path "$srcJava\controller\GeoFeatureController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\controller\ArLandformController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\controller\HomeController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\controller\UploadController.java" -Destination $ctrlDir -Force
Copy-Item -Path "$srcJava\service\GeoFeatureService.java" -Destination $svcDir -Force
Copy-Item -Path "$srcJava\service\ArLandformService.java" -Destination $svcDir -Force
Write-Host "  Done" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Migration complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Delete or keep old src/ directory"
Write-Host "  2. Compile: mvn clean compile -f pom.xml"
Write-Host "  3. Start services:"
Write-Host "     Auth:    mvn spring-boot:run -pl bankend-auth-service"
Write-Host "     User:    mvn spring-boot:run -pl bankend-user-service"
Write-Host "     Content: mvn spring-boot:run -pl bankend-content-service"
Write-Host "     Geo:     mvn spring-boot:run -pl bankend-geo-service"
Write-Host ""
