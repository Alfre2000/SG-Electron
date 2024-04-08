const query = `
DECLARE @StartDate DATETIME = '{{ startDate }}';
DECLARE @EndDate DATETIME = '{{ endDate }}';
SELECT
    productioncode AS id,
    partnumber AS PartNumber,
    pieces AS Pieces,
    cyclenumber AS CycleNumber,
    DATEADD(hour, -2, DateFrom) AS dataInizio,
    DATEADD(hour, -2, DateUnload) AS dataFine,
    state AS status
FROM
    Production
WHERE
    Pieces != 0 AND PartNumber <> 'Vuoto' -- Escludi telai vuoti
    AND DateUnload IS NOT NULL -- Telai completati
    AND DateFrom BETWEEN @StartDate AND @EndDate -- Solo telai prodotti nel periodo tra Data Inizio e Data Fine
    AND (DATEDIFF(minute, DateFrom, DateUnload) > 30 OR (DateFrom >= DATEADD(hour, -5, GETDATE()) AND State IN ('U', 'N'))) -- Minimo 30 minuti di produzione. A parte per le lavorazioni che non sono "eliminate" e che sono recenti.
ORDER BY DateFrom DESC;
`

export default query;