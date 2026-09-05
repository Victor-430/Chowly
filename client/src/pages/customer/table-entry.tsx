import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useRestaurantStore } from '@/stores/restaurant-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { HiStar, HiClock, HiCheck, HiTableCells, HiArrowRight, HiArrowLeft } from 'react-icons/hi2';
import { toast } from 'sonner';

export default function TableEntry() {
  const { tableId: paramTableId } = useParams();
  const navigate = useNavigate();
  const { restaurant, tables, tableNumber, setTable, fetchTables, fetchRestaurant } = useRestaurantStore();
  
  const [selectedTable, setSelectedTable] = useState<number>(() => {
    if (paramTableId && !isNaN(Number(paramTableId))) {
      return Number(paramTableId);
    }
    return tableNumber || 4;
  });
  const [customTableInput, setCustomTableInput] = useState('');

  // Fetch tables and restaurant on mount if not loaded
  useEffect(() => {
    fetchRestaurant();
    fetchTables();
  }, [fetchRestaurant, fetchTables]);

  // Update store when tableId is provided in URL
  useEffect(() => {
    if (paramTableId && !isNaN(Number(paramTableId))) {
      const num = Number(paramTableId);
      const matched = tables.find((t) => t.number === num);
      setTable(num, matched?.id);
      setSelectedTable(num);
    }
  }, [paramTableId, tables, setTable]);

  const displayTables = tables.length > 0
    ? tables.map((t) => ({ number: t.number, id: t.id, status: t.status }))
    : Array.from({ length: 15 }, (_, i) => ({ number: i + 1, id: undefined, status: 'available' }));

  const handleSelectTable = (num: number, id?: string) => {
    setSelectedTable(num);
    const resolvedId = id || tables.find((t) => t.number === num)?.id;
    setTable(num, resolvedId);
    toast.success(`Table ${String(num).padStart(2, '0')} selected`);
  };

  const handleCustomTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customTableInput, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 99) {
      handleSelectTable(parsed);
      setCustomTableInput('');
    } else {
      toast.error('Please enter a valid table number (1-99)');
    }
  };

  const handleProceedToMenu = () => {
    setTable(selectedTable);
    toast.success(`Table ${String(selectedTable).padStart(2, '0')} confirmed`);
    navigate('/customer/menu');
  };

  const handleProceedToHome = () => {
    setTable(selectedTable);
    navigate('/customer');
  };

  return (
    <div className="min-h-screen bg-warm-white pb-16">
      {/* ── Top Bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/customer')}
            className="flex items-center gap-2 text-charcoal hover:text-amber transition-colors text-sm font-medium"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Back to Restaurant</span>
          </button>
          <span className="text-sm font-bold tracking-tight text-charcoal">CHOWLY</span>
        </div>
      </header>

      {/* ── Hero Restaurant Info ───────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-card overflow-hidden border border-border shadow-sm mb-6 bg-charcoal text-white">
          <div
            className="h-44 sm:h-52 w-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${restaurant.image})` }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 w-full">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {restaurant.name}
                  </h1>
                  <div className="flex items-center gap-3 mt-1.5 text-xs sm:text-sm text-gray-200">
                    <div className="flex items-center">
                      <HiStar className="w-4 h-4 text-amber mr-1" />
                      <span>{restaurant.rating}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center">
                      <HiClock className="w-4 h-4 mr-1" />
                      <span>~{restaurant.avgPrepTime} min prep</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-emerald-600 text-white font-medium border-none">
                  Open now
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* ── Current Selected Table Summary ────────────────── */}
        <Card className="border-border shadow-sm mb-6 bg-surface">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-amber/15 text-amber flex items-center justify-center shrink-0">
                  <HiTableCells className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                    Current Seating
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-charcoal">
                    Table {String(selectedTable).padStart(2, '0')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  className="flex-1 sm:flex-initial"
                  onClick={handleProceedToHome}
                >
                  Home
                </Button>
                <Button
                  variant="amber"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2"
                  onClick={handleProceedToMenu}
                >
                  <span>View Menu</span>
                  <HiArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Select / Change Table Section ─────────────────── */}
        <div className="bg-surface rounded-card border border-border p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-charcoal">Select Your Table</h2>
            <p className="text-sm text-text-secondary mt-0.5">
              Choose your table number or scan the QR code at your dining table.
            </p>
          </div>

          {/* Table Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-6">
            {displayTables.map((tbl) => {
              const isSelected = selectedTable === tbl.number;
              const isOccupied = tbl.status === 'occupied';
              return (
                <button
                  key={tbl.id || tbl.number}
                  type="button"
                  onClick={() => handleSelectTable(tbl.number, tbl.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-150 ${
                    isSelected
                      ? 'bg-charcoal text-white border-charcoal shadow-md scale-105 ring-2 ring-amber/50'
                      : isOccupied
                      ? 'bg-gray-100 text-text-secondary border-dashed border-border hover:border-amber/50'
                      : 'bg-warm-white text-charcoal border-border hover:border-amber hover:bg-amber/5'
                  }`}
                >
                  <div className="flex items-center justify-between w-full text-[10px] font-medium opacity-70">
                    <span>Table</span>
                    {isOccupied && <span className="text-amber text-[9px]">In Use</span>}
                  </div>
                  <span className="text-lg font-bold leading-tight my-1">
                    {String(tbl.number).padStart(2, '0')}
                  </span>
                  {isSelected ? (
                    <HiCheck className="w-3.5 h-3.5 text-amber mt-0.5" />
                  ) : (
                    <span className="text-[10px] text-text-secondary">4 seats</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Table Input */}
          <div className="pt-4 border-t border-border">
            <form onSubmit={handleCustomTableSubmit} className="flex gap-2">
              <Input
                type="number"
                min="1"
                max="99"
                placeholder="Other table number..."
                value={customTableInput}
                onChange={(e) => setCustomTableInput(e.target.value)}
                className="max-w-50"
              />
              <Button type="submit" variant="secondary">
                Set Table
              </Button>
            </form>
          </div>
        </div>

        {/* ── Bottom Continue CTA ────────────────────────────── */}
        <div className="mt-8 text-center">
          <Button
            variant="amber"
            size="lg"
            className="w-full sm:w-auto px-10 h-14 rounded-full text-lg font-semibold shadow-md"
            onClick={handleProceedToMenu}
          >
            Continue to Menu as Table {String(selectedTable).padStart(2, '0')}
          </Button>
          <p className="text-xs text-text-secondary mt-3">
            Your table context will be automatically attached to your orders.
          </p>
        </div>
      </div>
    </div>
  );
}