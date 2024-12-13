// utils/spinHandlers.ts
export const handleSpin = (params) => {
    const { selectedSpinType, setTickets, setTotal, setBblip, generateRandomNumber, counterRefs, setNumbers, setWinAmount, setWinModalOpen, spinAudio, winAudio, selectedBalance } = params;
  
    if (selectedSpinType === 'ticket' && params.tickets === 0) return;
    if (selectedSpinType === 'total' && params.total < 200) return;
    if (selectedSpinType === 'bblip' && params.bblip < 1000) return;
  
    try {
      spinAudio.current.play();
    } catch (error) {
      console.error("Sound playback error:", error);
    }
  
    if (selectedSpinType === 'ticket') {
      setTickets((prev) => {
        const newTickets = prev - 1;
        localStorage.setItem('tickets', newTickets.toString());
        return newTickets;
      });
    } else if (selectedSpinType === 'total') {
      setTotal((prev) => {
        const newTotal = prev - 200;
        localStorage.setItem('total', newTotal.toString());
        return newTotal;
      });
    } else if (selectedSpinType === 'bblip') {
      setBblip((prev) => {
        const newBblip = prev - 1000;
        localStorage.setItem('bblip', newBblip.toString());
        return newBblip;
      });
    }
  
    const newNumbers = Array.from({ length: 6 }, (_, index) => {
      if (selectedBalance === 'total' && selectedSpinType === 'total') {
        return index === 0 ? '0' : generateRandomNumber(0, 9).toString();
      }
      return generateRandomNumber(0, 9).toString();
    });
  
    const newNumberString = newNumbers.join('');
    setNumbers(newNumberString);
  
    counterRefs.forEach((ref, index) => {
      const isRed = selectedSpinType === 'total' && index === 0;
      setTimeout(() => {
        if (!isRed) {
          ref.current?.startAnimation({
            duration: 2,
            value: newNumberString[index],
          });
        }
      }, index * 100);
    });
  
    setTimeout(() => {
      const newNumberValue = parseInt(newNumberString, 10);
  
      if (selectedBalance === 'total') {
        setTotal((prev) => prev + newNumberValue);
      } else if (selectedBalance === 'bblip') {
        setBblip((prev) => prev + newNumberValue);
      }
  
      if (newNumberValue > 0) {
        winAudio.current.play();
        setWinAmount(newNumberString);
        setWinModalOpen(true);
      }
    }, 2500);
  };