$body = @{
    email            = "demo@crm.local"
    password         = "Test1234"
    firstName        = "Demo"
    lastName         = "User"
    organizationSlug = "demo-org"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body -ErrorAction Stop
    
    Write-Host "Registration successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Use these credentials to login:" -ForegroundColor Cyan
    Write-Host "Email: demo@crm.local"
    Write-Host "Password: Test1234"
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Yellow
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
}
catch {
    Write-Host "Registration failed!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

