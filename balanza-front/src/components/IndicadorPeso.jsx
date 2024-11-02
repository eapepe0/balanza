
const IndicadorPeso = ( {targetWeight ,currentWeight}) => {
  const getIndicatorColor = () => {
    const percentageDifference = (currentWeight / targetWeight) * 100

    if (percentageDifference <= 30) return 'green';
    if (percentageDifference <= 49) return 'yellow';
    if (percentageDifference <= 85) return 'orange';
    return 'red';
  };

  const getProgressPercentage = () => {
    const progress = (currentWeight / targetWeight) * 100;
    console.log(Math.min(progress,100))
    return Math.min(progress, 100);
  };

  return (
    <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
      <div
        style={{
          width: '100%',
          height: '30px',
          backgroundColor: '#e0e0e0',
          borderRadius: '15px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${getProgressPercentage()}%`,
            height: '100%',
            backgroundColor: getIndicatorColor(),
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <p style={{ textAlign: 'center', marginTop: '10px', color: currentWeight > targetWeight ? 'red' : 'black' }}>
        Peso actual: {currentWeight}g / Objetivo: {targetWeight}g
      </p>
    </div>
  );
};

export default IndicadorPeso;