
$folders =  Get-ChildItem .\src\days

$count=0

ForEach ($folder in $folders) {
    $count=$count + 1

    $dir=$folder.name
    $img=$folder.fullname + "\screenshot.png"
    $url="http://localhost:8000/days/" + $dir

    #write-host chrome --headless --disable-gpu --screenshot=""""$img"""" $url
    write-host "$dir"
    chrome --headless --disable-gpu --screenshot="$img" "$url"

    #if ($count -eq 10) {
    #    break
    #}
}
