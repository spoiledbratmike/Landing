$path = "C:\Users\Isabel\Pictures\Lightworker Welcome page ONLY\Welcome page only\src\App.tsx"
$content = Get-Content $path -Raw
if ($content -notmatch "Welcome") {
    $content = $content.Replace('import Contact from "./pages/Contact";', "import Contact from `"./pages/Contact`";`r`nimport Welcome from `"./pages/Welcome`";")
    $routes = @"
            <Route path="/contact" element={<Contact />} />
            <Route path="/welcome" element={<Welcome />} />
"@
    $content = $content.Replace("            <Route path=`"/contact`" element={<Contact />} />", $routes)
    Set-Content $path -Value $content -NoNewline
    Write-Output "done"
} else {
    Write-Output "exists"
}