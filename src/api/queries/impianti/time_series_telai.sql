DECLARE @GroupByHour INT = {{ groupByHour }};
DECLARE @StartDate DATETIME = '{{ startDate }}';
DECLARE @EndDate DATETIME = '{{ endDate }}';

WITH DateRange AS (
    SELECT TOP (DATEDIFF(HOUR, @StartDate, @EndDate) - @GroupByHour + 1)
        hourNum = DATEADD(HOUR, ROW_NUMBER() OVER(ORDER BY a.object_id) - 1, @StartDate)
    FROM sys.all_objects a
    CROSS JOIN sys.all_objects b
),
FilteredHours AS (
    SELECT
        CAST(hourNum AS DATE) AS date,
        (DATEPART(hour, hourNum) / @GroupByHour) * @GroupByHour AS hourGroup,
        CASE 
            WHEN DATEPART(weekday, hourNum) = 7 AND DATEPART(hour, hourNum) >= 7 THEN 0 -- Exclude from 7 AM on Saturday
            WHEN DATEPART(weekday, hourNum) = 1 THEN 0 -- Exclude all hours on Sunday
            WHEN DATEPART(weekday, hourNum) = 2 AND DATEPART(hour, hourNum) < 6 THEN 0 -- Exclude until 6 AM on Monday
            ELSE 1
        END AS IncludeHour
    FROM DateRange
),
AggregatedProduction AS (
    SELECT
        CAST(DateFrom AS DATE) AS date,
        (DATEPART(hour, DateFrom) / @GroupByHour) * @GroupByHour AS hourGroup,
        COUNT(*) AS nTelai
    FROM
        Production
    WHERE
        Pieces != 0
        AND PartNumber <> 'Vuoto'
        AND DateUnload IS NOT NULL
        AND DateFrom BETWEEN @StartDate AND @EndDate
    GROUP BY
        CAST(DateFrom AS DATE),
        (DATEPART(hour, DateFrom) / @GroupByHour) * @GroupByHour
)
SELECT DISTINCT
    f.date,
    f.hourGroup AS hour,
    ISNULL(p.nTelai, 0) AS nTelai
FROM FilteredHours f
LEFT JOIN AggregatedProduction p ON f.date = p.date AND f.hourGroup = p.hourGroup
WHERE f.IncludeHour = 1
ORDER BY f.date, f.hourGroup;
