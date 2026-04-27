async function run() {
    const urls = [
        "http://localhost:8000/api/v1/analytics/placement-trend",
        "http://localhost:8000/api/v1/analytics/branch-wise",
        "http://localhost:8000/api/v1/analytics/salary-distribution",
        "http://localhost:8000/api/v1/analytics/top-hiring",
        "http://localhost:8000/api/v1/analytics/minor-impact",
        "http://localhost:8000/api/v1/analytics/multiple-offers",
        "http://localhost:8000/api/v1/placements/stats"
    ];

    for (let url of urls) {
        try {
            const res = await fetch(url);
            const data = await res.json();
            console.log(`\nURL: ${url}`);
            console.log(JSON.stringify(data, null, 2));
        } catch (e) {
            console.error(`Failed: ${url}`, e.message);
        }
    }
}
run();
