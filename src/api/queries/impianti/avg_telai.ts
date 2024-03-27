const query = `WITH DateRange AS (
    SELECT TOP (DATEDIFF(HOUR, DATEADD(week, -2, GETDATE()), GETDATE()))
        hourNum = DATEADD(HOUR, ROW_NUMBER() OVER(ORDER BY a.object_id) - 1, DATEADD(week, -2, GETDATE()))
    FROM sys.all_objects a
    CROSS JOIN sys.all_objects b
),
FilteredHours AS (
    SELECT
        CAST(hourNum AS DATE) AS date,
        DATEPART(hour, hourNum) AS hour,
        CASE
            WHEN DATEPART(weekday, hourNum) = 7 AND DATEPART(hour, hourNum) >= 7 THEN 0 -- Exclude from 7 AM on Saturday
            WHEN DATEPART(weekday, hourNum) = 1 THEN 0 -- Exclude all hours on Sunday
            WHEN DATEPART(weekday, hourNum) = 2 AND DATEPART(hour, hourNum) < 6 THEN 0 -- Exclude until 7 AM on Monday
            ELSE 1
        END AS IncludeHour,
        CASE 
            WHEN hourNum >= DATEADD(week, -1, GETDATE()) THEN 'LastWeek'
            ELSE 'WeekBeforeLast'
        END AS WeekCategory
    FROM DateRange
),
ProductionData AS (
    SELECT
        CAST(DateFrom AS DATE) AS date,
        DATEPART(hour, DateFrom) AS hour,
        COUNT(*) AS nTelai,
        CASE 
            WHEN DateFrom >= DATEADD(week, -1, GETDATE()) THEN 'LastWeek'
            ELSE 'WeekBeforeLast'
        END AS WeekCategory
    FROM
        Production
    WHERE
        Pieces != 0
        AND PartNumber <> 'Vuoto'
        AND DateUnload IS NOT NULL
        AND DateFrom BETWEEN DATEADD(week, -2, GETDATE()) AND GETDATE()
    GROUP BY
        CAST(DateFrom AS DATE),
        DATEPART(hour, DateFrom),
        CASE 
            WHEN DateFrom >= DATEADD(week, -1, GETDATE()) THEN 'LastWeek'
            ELSE 'WeekBeforeLast'
        END
)
SELECT
    f.WeekCategory,
    AVG(CAST(ISNULL(p.nTelai, 0) AS float)) AS avgTelai
FROM FilteredHours f
LEFT JOIN ProductionData p ON f.date = p.date AND f.hour = p.hour AND f.WeekCategory = p.WeekCategory
WHERE f.IncludeHour = 1
    AND ISNULL(p.nTelai, 0) BETWEEN 1 AND 6
GROUP BY f.WeekCategory;`;

export default query;
