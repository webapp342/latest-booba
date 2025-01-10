import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  TextField,

  Fab,
  Drawer,
  useTheme,
  useMediaQuery,
  Chip,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { doc, getDoc, updateDoc, addDoc, collection, query, where, getDocs, orderBy, deleteDoc, limit } from 'firebase/firestore';
import { db } from '../firebase';

interface BetSelection {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  betType: string;
  selection: string;
  odds: number;
}

interface BetSlipProps {
  selections: BetSelection[];
  onRemoveSelection: (matchId: string, betType: string) => void;
  onClearSlip: () => void;
}

interface UserBalances {
  bblip: number;
  total: number;
  ticket: number;
}

const BetSlip: React.FC<BetSlipProps> = ({
  selections,
  onRemoveSelection,
  onClearSlip,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [currency] = useState<'TOTAL'>('TOTAL');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [userBalances, setUserBalances] = useState<UserBalances | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startedMatches, setStartedMatches] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'newBet' | 'activeCoupons'>('activeCoupons');
  const [activeCoupons, setActiveCoupons] = useState<any[]>([]);
  const [shouldRefreshCoupons, setShouldRefreshCoupons] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Maç durumlarını kontrol et
  useEffect(() => {
    const checkMatchStatus = async () => {
      const matchStatuses: { [key: string]: boolean } = {};
      
      for (const selection of selections) {
        try {
          const matchDoc = await getDoc(doc(db, 'matches', selection.matchId));
          if (matchDoc.exists()) {
            const matchData = matchDoc.data();
            matchStatuses[selection.matchId] = matchData.matchStarted || false;
          }
        } catch (error) {
          console.error('Maç durumu kontrol hatası:', error);
        }
      }
      
      setStartedMatches(matchStatuses);
    };

    if (selections.length > 0) {
      checkMatchStatus();
    }
  }, [selections]);

  // Kullanıcı bakiyelerini çek
  useEffect(() => {
    const fetchUserBalances = async () => {
      try {
        const userId = localStorage.getItem('telegramUserId');
        if (!userId) {
          console.error('Kullanıcı ID bulunamadı');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserBalances({
            bblip: userData.bblip || 0,
            total: userData.total || 0,
            ticket: userData.ticket || 0
          });
        } else {
          console.error('Kullanıcı bulunamadı');
        }
      } catch (error) {
        console.error('Bakiye çekme hatası:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBalances();
  }, []);

  // Debug için seçili oranları konsola yazdır
  console.log('Seçili oranlar:', selections.map(s => s.odds));

  // Toplam oranı hesapla
  const totalOdds = selections.reduce((acc, curr) => {
    console.log('Mevcut çarpım:', acc, 'Yeni oran:', curr.odds);
    return acc * Number(curr.odds);
  }, 1);

  // Potansiyel kazancı hesapla
  const potentialWin = amount ? Number(amount) * totalOdds : 0;

  // Debug için sonuçları konsola yazdır
  console.log('Toplam oran:', totalOdds, 'Potansiyel kazanç:', potentialWin);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

 

  const getCurrentBalance = () => {
    if (!userBalances) return 0;
    return userBalances.total / 1000;
  };

  // Kuponları getir
  const fetchActiveCoupons = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('telegramUserId');
      if (!userId) {
        console.log('Kullanıcı ID bulunamadı');
        return;
      }

      console.log('Son kuponlar getiriliyor, userId:', userId);

      const couponsRef = collection(db, 'coupons');
      // Basitleştirilmiş sorgu - sadece userId'ye göre filtrele
      const q = query(
        couponsRef,
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      console.log('Bulunan kupon sayısı:', querySnapshot.size);
      
      if (querySnapshot.empty) {
        console.log('Hiç kupon bulunamadı');
        setActiveCoupons([]);
        return;
      }

      // Tüm kuponları al, JavaScript'te sırala ve son 3'ü seç
      const coupons = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || new Date().toISOString()
        }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 3);
      
      console.log('Son 3 kupon:', coupons);
      setActiveCoupons(coupons);

    } catch (error) {
      console.error('Kupon getirme hatası:', error);
      setActiveCoupons([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Component mount olduğunda kuponları getir
  useEffect(() => {
    fetchActiveCoupons();
  }, []);

  // Yeni kupon eklendiğinde kuponları yenile
  useEffect(() => {
    if (selections.length === 0) {
      fetchActiveCoupons();
    }
  }, [selections]);

  const handlePlaceBet = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('telegramUserId');
      if (!userId) {
        console.error('Kullanıcı ID bulunamadı');
        return;
      }

      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.error('Kullanıcı bulunamadı');
        return;
      }

      const userData = userDoc.data();
      const currentBalance = userData.total || 0;
      const betAmount = Number(amount);
      const dbBetAmount = betAmount * 1000;

      if (currentBalance < dbBetAmount) {
        console.error('Yetersiz bakiye');
        return;
      }

      const createdAt = new Date().toISOString();
      const couponData = {
        userId,
        selections: selections.map(s => ({
          matchId: s.matchId,
          homeTeam: s.homeTeam,
          awayTeam: s.awayTeam,
          betType: s.betType,
          selection: s.selection,
          odds: s.odds
        })),
        amount: dbBetAmount,
        currency: 'TOTAL',
        totalOdds,
        potentialWin: dbBetAmount * totalOdds,
        status: 'active',
        createdAt: createdAt,
        paid: false
      };

      console.log('Kaydedilecek kupon:', couponData);

      const couponsRef = collection(db, 'coupons');
      const couponRef = await addDoc(couponsRef, couponData);
      console.log('Kupon kaydedildi, ID:', couponRef.id);

      await updateDoc(userRef, {
        total: currentBalance - dbBetAmount
      });

      setUserBalances(prev => prev ? {
        ...prev,
        total: currentBalance - dbBetAmount
      } : null);

      setAmount('');
      onClearSlip();
      setIsDrawerOpen(false);
      setShouldRefreshCoupons(prev => !prev);
      setActiveTab('activeCoupons');
      alert('Kupon başarıyla oluşturuldu!');

    } catch (error) {
      console.error('Bahis yapma hatası:', error);
      alert('Kupon oluşturulurken bir hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  // Kazanan kuponları kontrol et
  const checkWinningBets = async () => {
    try {
      const userId = localStorage.getItem('telegramUserId');
      if (!userId) return;

      console.log('Kuponları kontrol etmeye başlıyorum...');

      // Aktif kuponları getir
      const couponsRef = collection(db, 'coupons');
      const q = query(couponsRef, 
        where('userId', '==', userId),
        where('status', '==', 'active'),
        where('paid', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      console.log(`${querySnapshot.docs.length} adet aktif kupon bulundu`);

      for (const couponDoc of querySnapshot.docs) {
        const coupon = couponDoc.data();
        console.log('Kupon kontrol ediliyor:', couponDoc.id, coupon);
        
        let isWinning = true;
        let allMatchesEnded = true;

        // Kuponda seçili tüm maçları kontrol et
        for (const selection of coupon.selections) {
          const matchDoc = await getDoc(doc(db, 'matches', selection.matchId));
          
          if (!matchDoc.exists()) {
            console.log(`Maç bulunamadı: ${selection.matchId}`);
            continue;
          }
          
          const matchData = matchDoc.data();
          console.log('Maç durumu:', {
            matchId: selection.matchId,
            matchStarted: matchData.matchStarted,
            matchEnded: matchData.matchEnded,
            selection: selection,
            goals: matchData.liveData?.goals
          });
          
          // Maç bitmemişse kupon durumunu değiştirme
          if (!matchData.matchEnded) {
            console.log(`Maç henüz bitmedi: ${selection.matchId}`);
            allMatchesEnded = false;
            break;
          }

          // Seçimin kazanıp kazanmadığını kontrol et
          const hasWon = await checkSelectionResult(selection, matchData);
          console.log(`Bahis sonucu:`, {
            selection: selection,
            hasWon: hasWon
          });
          
          if (!hasWon) {
            isWinning = false;
            break;
          }
        }

        console.log('Kupon durumu:', {
          couponId: couponDoc.id,
          allMatchesEnded: allMatchesEnded,
          isWinning: isWinning
        });

        // Sadece tüm maçlar bitmişse kupon durumunu güncelle
        if (allMatchesEnded) {
          if (isWinning) {
            console.log('Kazanan kupon işleniyor:', couponDoc.id);
            const userRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const currentBalance = userData[coupon.currency.toLowerCase()] || 0;
              const winAmount = coupon.potentialWin;
              
              console.log('Ödeme yapılıyor:', {
                currency: coupon.currency,
                currentBalance: currentBalance,
                winAmount: winAmount
              });

              // Bakiyeyi güncelle
              await updateDoc(userRef, {
                [coupon.currency.toLowerCase()]: currentBalance + winAmount
              });

              // Kuponu ödenmiş olarak işaretle
              await updateDoc(doc(db, 'coupons', couponDoc.id), {
                status: 'won',
                paid: true,
                paidAt: new Date().toISOString()
              });

              // State'i güncelle
              setUserBalances(prev => prev ? {
                ...prev,
                [coupon.currency.toLowerCase()]: currentBalance + winAmount
              } : null);

              console.log(`Kupon kazandı ve ödeme yapıldı: ${couponDoc.id}`);
            }
          } else {
            console.log('Kaybeden kupon işaretleniyor:', couponDoc.id);
            // Sadece tüm maçlar bitmişse kaybeden olarak işaretle
            await updateDoc(doc(db, 'coupons', couponDoc.id), {
              status: 'lost',
              updatedAt: new Date().toISOString()
            });
          }
        } else {
          console.log(`Kupon hala aktif, tüm maçlar bitmedi: ${couponDoc.id}`);
        }
      }
    } catch (error) {
      console.error('Kupon kontrol hatası:', error);
    }
  };

  // Seçimin sonucunu kontrol et
  const checkSelectionResult = async (selection: BetSelection, matchData: any) => {
    const { betType, selection: betSelection } = selection;
    const { goals} = matchData.liveData;
    const totalGoals = goals.home + goals.away;
    const firstHalfGoals = matchData.liveData?.halftimeScore?.home ?? 0 + matchData.liveData?.halftimeScore?.away ?? 0;
    const secondHalfGoals = totalGoals - firstHalfGoals;

    switch (betType) {
      case '1x2':
        // Maç sonucu kontrolü
        if (betSelection === 'home' && goals.home > goals.away) return true;
        if (betSelection === 'draw' && goals.home === goals.away) return true;
        if (betSelection === 'away' && goals.away > goals.home) return true;
        break;

      case 'doubleChance':
        // Çifte şans kontrolü
        if (betSelection === 'home_draw' && goals.home >= goals.away) return true;
        if (betSelection === 'draw_away' && goals.home <= goals.away) return true;
        if (betSelection === 'home_away' && goals.home !== goals.away) return true;
        break;

      case 'overUnder':
        // Alt/Üst kontrolü
        const limit = Number(betSelection.split('_')[1]);
        if (betSelection.startsWith('over') && totalGoals > limit) return true;
        if (betSelection.startsWith('under') && totalGoals < limit) return true;
        break;

      case 'goalInBothHalves':
        // Her iki yarıda da gol kontrolü
        const hasGoalsInBothHalves = firstHalfGoals > 0 && secondHalfGoals > 0;
        if (betSelection === 'yes' && hasGoalsInBothHalves) return true;
        if (betSelection === 'no' && !hasGoalsInBothHalves) return true;
        break;

      case 'firstGoal':
        // İlk gol kontrolü
        const firstGoalScorer = matchData.firstGoalScorer;
        if (betSelection === firstGoalScorer) return true;
        if (firstGoalScorer === '' && betSelection === 'None') return true;
        break;

      case 'handicap':
        // Handikap kontrolü
        const [team, handicapValue] = betSelection.split('_');
        const handicap = Number(handicapValue);
        const homeScoreWithHandicap = goals.home + (team === 'home' ? handicap : 0);
        const awayScoreWithHandicap = goals.away + (team === 'away' ? handicap : 0);
        
        if (team === 'home' && homeScoreWithHandicap > awayScoreWithHandicap) return true;
        if (team === 'away' && awayScoreWithHandicap > homeScoreWithHandicap) return true;
        break;

      case 'oddEven':
        // Tek/Çift kontrolü
        const isOdd = totalGoals % 2 !== 0;
        if (betSelection === 'odd' && isOdd) return true;
        if (betSelection === 'even' && !isOdd) return true;
        break;
    }

    return false;
  };

  // Düzenli olarak aktif kuponları kontrol et
  useEffect(() => {
    // İlk kontrol
    checkWinningBets();

    // Her 30 saniyede bir kontrol et
    const interval = setInterval(() => {
      console.log('Aktif kuponlar kontrol ediliyor...');
      checkWinningBets();
    }, 30000);

    // Component unmount olduğunda interval'i temizle
    return () => clearInterval(interval);
  }, []); // Boş dependency array ile sadece component mount olduğunda başlat

  // Seçimler değiştiğinde de kontrol et
  useEffect(() => {
    if (selections.length > 0) {
      checkWinningBets();
    }
  }, [startedMatches]);

  // Başlamış maç var mı kontrol et
  const hasStartedMatch = () => {
    return Object.values(startedMatches).some(started => started);
  };

  // Başlamış maçları filtrele
  const getStartedMatchNames = () => {
    return selections
      .filter(selection => startedMatches[selection.matchId])
      .map(selection => `${selection.homeTeam} vs ${selection.awayTeam}`)
      .join(', ');
  };

  // Kupon durumuna göre renk ve metin belirle
  const getCouponStatusInfo = (status: string) => {
    switch(status) {
      case 'won':
        return { color: 'success.main', text: 'Kazandı' };
      case 'lost':
        return { color: 'error.main', text: 'Kaybetti' };
      default:
        return { color: 'info.main', text: 'Aktif' };
    }
  };

  const activeCouponsContent = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Son Kuponlarım</Typography>
      {isLoading ? (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Kuponlar yükleniyor...
        </Typography>
      ) : activeCoupons.length === 0 ? (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Henüz kuponunuz bulunmamaktadır
        </Typography>
      ) : (
        activeCoupons.map((coupon: any) => {
          const statusInfo = getCouponStatusInfo(coupon.status);
          return (
            <Card key={coupon.id} sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5' }}>
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" color="primary">
                    Kupon #{coupon.id.slice(-6)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {new Date(coupon.createdAt).toLocaleString('tr-TR')}
                  </Typography>
                </Box>
                <Chip 
                  label={statusInfo.text}
                  size="small"
                  sx={{ 
                    color: 'white',
                    bgcolor: statusInfo.color
                  }}
                />
              </Box>
              
              {coupon.selections?.map((selection: any, index: number) => (
                <Box key={index} sx={{ mb: 1, pb: 1, borderBottom: index !== coupon.selections.length - 1 ? '1px solid #ddd' : 'none' }}>
                  <Typography variant="body2">
                    {selection.homeTeam} vs {selection.awayTeam}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selection.betType}: {selection.selection}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Oran: {selection.odds.toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid #ddd' }}>
                <Typography variant="body2">
                  Toplam Oran: {coupon.totalOdds.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  Miktar: {(coupon.amount / 1000).toFixed(2)} {coupon.currency}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: statusInfo.color }}>
                  {coupon.status === 'won' ? 'Kazanç:' : 'Potansiyel Kazanç:'} {(coupon.potentialWin / 1000).toFixed(2)} {coupon.currency}
                </Typography>
              </Box>
            </Card>
          );
        })
      )}
    </Box>
  );

  const betSlipContent = (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Bahis Kuponu</Typography>
        {selections.length > 0 && (
          <IconButton onClick={onClearSlip} size="small">
            <ClearIcon />
          </IconButton>
        )}
      </Box>

      {/* Başlamış maç uyarısı */}
      {hasStartedMatch() && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Aşağıdaki maç(lar) başladığı için bahis yapılamaz: {getStartedMatchNames()}
        </Alert>
      )}

      {/* Bakiye gösterimi */}
      {userBalances && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalanceWalletIcon color="primary" />
          <Typography variant="body2">
            Bakiye: {getCurrentBalance().toFixed(2)} TOTAL
          </Typography>
        </Box>
      )}

      {selections.length === 0 ? (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Henüz seçim yapılmadı
        </Typography>
      ) : (
        <>
          {selections.map((selection) => (
            <Card
              key={`${selection.matchId}-${selection.betType}`}
              sx={{ mb: 1, p: 1, backgroundColor: '#f5f5f5' }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {selection.homeTeam} vs {selection.awayTeam}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selection.betType}: {selection.selection}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Oran: {selection.odds.toFixed(2)}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => onRemoveSelection(selection.matchId, selection.betType)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          ))}

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Toplam Oran: {totalOdds.toFixed(2)}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="Miktar"
                value={amount}
                onChange={handleAmountChange}
                size="small"
                fullWidth
                error={Number(amount) > getCurrentBalance()}
                helperText={Number(amount) > getCurrentBalance() ? "Yetersiz bakiye" : ""}
              />
            </Box>

            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Potansiyel Kazanç: {(Number(amount) * totalOdds).toFixed(2)} TOTAL
            </Typography>
          </Box>
        </>
      )}
    </>
  );

  const betButton = selections.length > 0 && (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      disabled={
        !amount || 
        Number(amount) <= 0 || 
        Number(amount) > getCurrentBalance() ||
        hasStartedMatch()
      }
      onClick={handlePlaceBet}
      sx={{ mt: 2 }}
    >
      {hasStartedMatch() ? 'Maç Başladı' : `Bahis Yap (${selections.length})`}
    </Button>
  );

  return (
    <>
      {/* Mobil görünüm için drawer ve floating button */}
      {isMobile ? (
        <>
          <Drawer
            anchor="bottom"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            PaperProps={{
              sx: {
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                maxHeight: '80vh',
                pb: 2,
                minHeight: '50vh'
              }
            }}
          >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab 
                  label="Yeni Kupon" 
                  value="newBet"
                  icon={<ShoppingCartIcon />}
                  iconPosition="start"
                />
                <Tab 
                  label={`Kuponlarım (${activeCoupons.length})`}
                  value="activeCoupons"
                  icon={<AccountBalanceWalletIcon />}
                  iconPosition="start"
                />
              </Tabs>

              <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {activeTab === 'newBet' ? (
                  <Box sx={{ p: 2 }}>
                    {betSlipContent}
                    {betButton}
                  </Box>
                ) : (
                  activeCouponsContent
                )}
              </Box>
            </Box>
          </Drawer>

          {/* Floating Action Button */}
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 72,
              right: 16,
              zIndex: 1000,
              boxShadow: 3
            }}
            onClick={() => setIsDrawerOpen(true)}
          >
            <Box sx={{ position: 'relative' }}>
              <ShoppingCartIcon />
              {(selections.length > 0 || activeCoupons.length > 0) && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: 'error.main',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.75rem',
                    boxShadow: 1
                  }}
                >
                  {selections.length + activeCoupons.length}
                </Box>
              )}
            </Box>
          </Fab>
        </>
      ) : (
        // Desktop görünümü
        <Card sx={{ 
          position: 'sticky',
          top: '16px',
          borderRadius: 3,
          boxShadow: 3,
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto'
        }}>
          <CardContent>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
              sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab 
                label="Yeni Kupon" 
                value="newBet"
                icon={<ShoppingCartIcon />}
                iconPosition="start"
              />
              <Tab 
                label={`Kuponlarım (${activeCoupons.length})`}
                value="activeCoupons"
                icon={<AccountBalanceWalletIcon />}
                iconPosition="start"
              />
            </Tabs>

            {activeTab === 'newBet' ? (
              <>
                {betSlipContent}
                {betButton}
              </>
            ) : (
              activeCouponsContent
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default BetSlip; 