# chaos.ps1 - The Attribution Engine Stress Tester

$Endpoint = "http://localhost:3000/api/v1/track"
$Headers = @{
    "Content-Type" = "application/json"
    "x-publishable-key" = "pk_test_123"
}

# Configuration
$RequestsToSend = 50 
$ViralGclid = "GCLID_VIRAL_CAMPAIGN_2025" # We will reuse this to test viral detection

$UserAgents = @(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
)

Write-Host "🔥 STARTING CHAOS SIMULATION: $RequestsToSend Events..." -ForegroundColor Cyan

1..$RequestsToSend | ForEach-Object {
    $i = $_
    $Scenario = Get-Random -Minimum 1 -Maximum 100
    $UUID = [guid]::NewGuid().ToString()
    $Timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    $UA = $UserAgents | Get-Random
    
    # --- SCENARIO GENERATOR ---
    
    if ($Scenario -le 50) {
        # 🟢 SCENARIO A: Standard Pageview (50% chance)
        # Result: Should Queue -> Process -> Skip/Fail Dispatch
        $Type = "pageview"
        $LogColor = "Green"
        $StatusMsg = "Standard Traffic"
        $Body = @{
            type = "pageview"
            anonymousId = $UUID
            consent = @{ ad_storage = "granted"; analytics_storage = "granted" }
            context = @{ url = "http://lawfirm.com/blog"; user_agent = $UA }
        }
    }
    elseif ($Scenario -le 70) {
        # 🟡 SCENARIO B: Privacy Denied (20% chance)
        # Result: Should Queue -> Process -> BLOCK Dispatch (Compliance)
        $Type = "pageview"
        $LogColor = "Yellow"
        $StatusMsg = "Consent DENIED"
        $Body = @{
            type = "pageview"
            anonymousId = $UUID
            consent = @{ ad_storage = "denied"; analytics_storage = "denied" }
            context = @{ url = "http://lawfirm.com/privacy"; user_agent = $UA }
        }
    }
    elseif ($Scenario -le 85) {
        # 🔵 SCENARIO C: High Value Purchase (15% chance)
        # Result: Should Queue -> Process -> CRM Sync
        $Type = "purchase"
        $LogColor = "Cyan"
        $StatusMsg = "Big Spender $$$"
        $Value = Get-Random -Minimum 1000 -Maximum 50000
        $Body = @{
            type = "purchase"
            anonymousId = $UUID
            consent = @{ ad_storage = "granted"; analytics_storage = "granted" }
            context = @{ url = "http://lawfirm.com/thank-you"; user_agent = $UA }
            user = @{ email = "client_$i@example.com" }
            data = @{ value = $Value; currency = "USD" }
            click = @{ gclid = "TEST_CLICK_$i" }
        }
    }
    elseif ($Scenario -le 95) {
        # 🟣 SCENARIO D: The Viral Loop (10% chance)
        # Result: Reuse SAME GCLID with DIFFERENT UUID
        $Type = "lead"
        $LogColor = "Magenta"
        $StatusMsg = "Viral Shared Link"
        $Body = @{
            type = "lead"
            anonymousId = $UUID
            consent = @{ ad_storage = "granted"; analytics_storage = "granted" }
            context = @{ url = "http://lawfirm.com/viral"; user_agent = $UA }
            click = @{ gclid = $ViralGclid } # <--- REUSED KEY
        }
    }
    else {
        # 🔴 SCENARIO E: The Hacker / Malformed (5% chance)
        # Result: Should return 202 -> QUARANTINE TABLE
        $Type = "ATTACK"
        $LogColor = "Red"
        $StatusMsg = "Malicious Payload"
        $Body = @{
            type = "lead"
            anonymousId = "NOT_A_UUID_SQL_INJECTION_'; DROP TABLE users; --" # <--- BAD ID
            consent = @{ ad_storage = "granted" }
            context = @{ url = "http://lawfirm.com/login" }
            user = @{ email = "<script>alert(1)</script>" }
        }
    }

    # Convert to JSON
    $JsonPayload = $Body | ConvertTo-Json -Depth 4

    try {
        # Send Request
        $Response = Invoke-RestMethod -Uri $Endpoint -Method Post -Headers $Headers -Body $JsonPayload -ErrorAction Stop
        
        # Check Response
        if ($Response.queued) {
            Write-Host "[$i] $StatusMsg ($Type) -> QUEUED" -ForegroundColor $LogColor
        }
        elseif ($Response.status -eq "quarantined_for_review") {
            Write-Host "[$i] $StatusMsg ($Type) -> 🛡️ QUARANTINED (Zero-Loss Active)" -ForegroundColor $LogColor
        }
    }
    catch {
        Write-Host "[$i] CRITICAL ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Slight delay to mimic burst traffic, not DoS
    Start-Sleep -Milliseconds (Get-Random -Minimum 10 -Maximum 100)
}

Write-Host "`n✅ SIMULATION COMPLETE." -ForegroundColor Green