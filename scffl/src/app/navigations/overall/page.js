'use client'
import React, { useState } from 'react';
import { Activity, Zap, Server, Navigation, Clock, CloudRain, AlertTriangle, Map, Settings } from 'lucide-react';

const OverallPage = () => {
    const [trafficMetrics, setTrafficMetrics] = useState(null);
    const [weatherMetrics, setWeatherMetrics] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Prediction State
    const [route, setRoute] = useState('Kompally');
    const [distance, setDistance] = useState(15.0);
    const [prediction, setPrediction] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);

    // Valid Hours for Dropdown
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    const [selectedTime, setSelectedTime] = useState('09:00');

    const [optimizationResult, setOptimizationResult] = useState(null);
    const [isOptimizing, setIsOptimizing] = useState(false);

    const runOptimization = async () => {
        setIsOptimizing(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/optimization/run_routing', {
                method: 'POST'
            });
            const data = await res.json();
            if (res.ok) setOptimizationResult(data);
        } catch (error) {
            console.error("Optimization failed:", error);
        } finally {
            setIsOptimizing(false);
        }
    };

    const runDiagnosis = async () => {
        setIsAnalyzing(true);
        try {
            // Run parallel requests
            const [trafficRes, weatherRes] = await Promise.all([
                fetch('http://127.0.0.1:8000/traffic/get_analysis', { method: 'POST' }),
                fetch('http://127.0.0.1:8000/weather/get_analysis', { method: 'POST' })
            ]);

            const trafficData = await trafficRes.json();
            const weatherData = await weatherRes.json();

            if (trafficRes.ok) setTrafficMetrics(trafficData.analysis);
            if (weatherRes.ok) setWeatherMetrics(weatherData.analysis);

        } catch (error) {
            console.error("Diagnosis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const predictDelivery = async () => {
        setIsPredicting(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/overall/predict_delivery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Use selectedTime
                body: JSON.stringify({ route_name: route, range_km: parseFloat(distance), start_time: selectedTime })
            });
            const data = await res.json();
            if (res.ok) setPrediction(data);
        } catch (error) {
            console.error("Prediction failed:", error);
        } finally {
            setIsPredicting(false);
        }
    };

    const MetricCard = ({ title, data, color }) => (
        <div className={`bg-gray-800 p-6 rounded-xl border-l-4 ${color}`}>
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4">{title}</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-500">Accuracy</p>
                    <p className="text-2xl font-mono text-white">{(data?.classification_metrics?.accuracy * 100).toFixed(1)}%</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">F1 Score</p>
                    <p className="text-2xl font-mono text-white">{(data?.classification_metrics?.f1_score * 100).toFixed(1)}%</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Precision</p>
                    <p className="text-2xl font-mono text-white">{(data?.classification_metrics?.precision * 100).toFixed(1)}%</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Recall</p>
                    <p className="text-2xl font-mono text-white">{(data?.classification_metrics?.recall * 100).toFixed(1)}%</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500 mb-2">Confusion Matrix</p>
                <div className="bg-gray-900 p-2 rounded text-xs font-mono text-gray-300">
                    {JSON.stringify(data?.classification_metrics?.confusion_matrix)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">System Intelligence & Diagnostics</h1>
                <p className="text-gray-400">Monitor LSTM model performance and run live delivery simulations.</p>
            </header>

            {/* Section 1: Diagnostics */}
            <section className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <Server className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-semibold text-white">Model Performance Diagnostics</h2>
                    </div>
                    <button
                        onClick={runDiagnosis}
                        disabled={isAnalyzing}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all"
                    >
                        {isAnalyzing ? <Activity className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        {isAnalyzing ? 'Running Full Diagnostics...' : 'Run System Diagnosis'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trafficMetrics ? (
                        <MetricCard title="Traffic Prediction Model (LSTM)" data={trafficMetrics} color="border-green-500" />
                    ) : (
                        <div className="h-48 bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-500 border border-dashed border-gray-700">
                            Run diagnosis to view Traffic metrics
                        </div>
                    )}

                    {weatherMetrics ? (
                        <MetricCard title="Weather Impact Model (LSTM)" data={weatherMetrics} color="border-blue-500" />
                    ) : (
                        <div className="h-48 bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-500 border border-dashed border-gray-700">
                            Run diagnosis to view Weather metrics
                        </div>
                    )}
                </div>
            </section>

            {/* Section 2: Intelligent Routing Optimization */}
            <section className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <Map className="w-6 h-6 text-pink-400" />
                        <div>
                            <h2 className="text-xl font-semibold text-white">Intelligent Route Optimization</h2>
                            <p className="text-xs text-gray-500">Hybrid IQPSO-SA Algorithm</p>
                        </div>
                    </div>
                    <button
                        onClick={runOptimization}
                        disabled={isOptimizing}
                        className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all"
                    >
                        {isOptimizing ? <Activity className="animate-spin w-4 h-4" /> : <Settings className="w-4 h-4" />}
                        {isOptimizing ? 'Optimizing Routes...' : 'Run Hybrid Optimization'}
                    </button>
                </div>

                {optimizationResult ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4">Optimized Sequence</h3>
                            <div className="space-y-3">
                                {optimizationResult.best_sequence.map((loc, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-pink-900 text-pink-300 flex items-center justify-center text-xs font-bold">
                                            {idx + 1}
                                        </div>
                                        <div className="text-white font-medium">{loc}</div>
                                        {idx < optimizationResult.best_sequence.length - 1 && (
                                            <div className="text-gray-600 text-xs">⬇</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-end">
                                <div>
                                    <p className="text-gray-500 text-xs">Total Estimated Duration</p>
                                    <p className="text-2xl font-bold text-white">{optimizationResult.min_total_time} min</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-green-400 text-sm font-bold">
                                        {optimizationResult.metrics?.improvement_pct}% Faster
                                    </span>
                                    <p className="text-gray-600 text-xs">vs Initial Random Route</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4">Algorithm Performance</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Cost Convergence (Lower is better)</span>
                                        <span>{optimizationResult.metrics?.iterations} Iterations</span>
                                    </div>
                                    <div className="h-32 flex items-end gap-1 bg-gray-900/50 rounded p-2 border border-gray-800">
                                        {optimizationResult.convergence.filter((_, i) => i % 5 === 0).map((val, i, arr) => {
                                            const max = Math.max(...arr);
                                            const min = Math.min(...arr);
                                            const height = ((val - min) / (max - min || 1)) * 100;
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex-1 bg-gradient-to-t from-pink-600 to-purple-600 rounded-sm opacity-80 hover:opacity-100 transition-all"
                                                    style={{ height: `${Math.max(10, height)}%` }}
                                                    title={`Iter ${i * 5}: ${val.toFixed(1)}`}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="bg-black/30 p-3 rounded border border-gray-700/50">
                                    <p className="text-xs text-blue-300 font-mono mb-1">Algorithm Strategy</p>
                                    <p className="text-xs text-gray-400">
                                        {optimizationResult.algorithm}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2 italic">
                                        Note: Uses real-time LSTM predictions for every candidate solution evaluation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-48 flex flex-col items-center justify-center bg-gray-800/30 rounded-xl border border-dashed border-gray-700 text-gray-500">
                        <Settings className="w-12 h-12 mb-4 opacity-30" />
                        <p>Run optimization to generate the most efficient delivery route</p>
                    </div>
                )}
            </section>

            {/* Section 3: Live Prediction */}
            <section className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                <div className="flex items-center space-x-3 mb-6">
                    <Navigation className="w-6 h-6 text-purple-400" />
                    <h2 className="text-xl font-semibold text-white">Live Delivery Simulator</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Form */}
                    <div className="bg-gray-800 p-6 rounded-xl space-y-4 h-fit">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Route Name</label>
                            <select
                                value={route}
                                onChange={(e) => setRoute(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                                <option value="Kompally">Kompally (North)</option>
                                <option value="Gachibowli">Gachibowli (West - IT Corridor)</option>
                                <option value="Uppal">Uppal (East)</option>
                                <option value="Mehdipatnam">Mehdipatnam (Central)</option>
                                <option value="Medchal">Medchal (Far North)</option>
                                <option value="L B Nagar">L B Nagar (South East)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Start Time</label>
                            <select
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none max-h-40 overflow-y-auto"
                            >
                                {hours.map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Distance (km)</label>
                            <input
                                type="number"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>

                        <button
                            onClick={predictDelivery}
                            disabled={isPredicting}
                            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
                        >
                            {isPredicting ? <Activity className="animate-spin w-4 h-4" /> : 'Simulate Delivery'}
                        </button>
                    </div>

                    {/* Results Display */}
                    <div className="lg:col-span-2">
                        {prediction ? (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-8">
                                        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                            <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                                            <p className="text-gray-400 text-sm mb-1">Model Estimate</p>
                                            <p className="text-3xl font-bold text-white">{prediction.estimated_delivery_time_mins} min</p>
                                            <p className="text-xs text-blue-400 mt-1">Based on LSTM</p>
                                        </div>
                                        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                            <Navigation className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                            <p className="text-gray-400 text-sm mb-1">Real-time Accurate</p>
                                            <p className="text-3xl font-bold text-white">
                                                {prediction.real_time_validation?.available
                                                    ? `${prediction.real_time_validation.metrics.tomtom_duration_mins} min`
                                                    : 'N/A'}
                                            </p>
                                            <p className="text-xs text-green-500 mt-1">
                                                {prediction.real_time_validation?.available ? 'TomTom Live Data' : 'Live Data Unavailable'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                                <Activity className="w-16 h-16 text-white" />
                                            </div>
                                            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                            <p className="text-gray-400 text-sm mb-1">Model Accuracy</p>
                                            <p className="text-3xl font-bold text-white">
                                                {prediction.real_time_validation?.available
                                                    ? `${prediction.real_time_validation.accuracy.time_accuracy_score}%`
                                                    : '-'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {prediction.real_time_validation?.available
                                                    ? `Deviation: ${prediction.real_time_validation.accuracy.time_diff_mins} min`
                                                    : 'Validation Pending'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm border-t border-gray-700 pt-6">
                                        <div>
                                            <p className="text-gray-500">Predicted Traffic</p>
                                            <p className="text-white font-mono">{prediction.predicted_traffic_index}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Predicted Rain</p>
                                            <p className="text-white font-mono">{prediction.predicted_rain_mm} mm</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Live Temp</p>
                                            <p className="text-white font-mono">
                                                {prediction.real_time_validation?.available
                                                    ? `${prediction.real_time_validation.metrics.real_temp_c}°C`
                                                    : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Current Speed</p>
                                            <p className="text-blue-400 font-mono">
                                                {prediction.real_time_validation?.available
                                                    ? `${prediction.real_time_validation.metrics.current_speed_kmh} km/h`
                                                    : '-'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 text-center">
                                        <p className="text-gray-400">Simulation running on hybrid engine.</p>
                                        <p className="text-sm text-gray-500 mt-1">Comparing Historical deep learning prediction with realtime Ground Truth.</p>
                                    </div>
                                </div>

                                {/* Raw Format Data Display */}
                                {prediction.real_time_validation?.raw_data && (
                                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 overflow-hidden">
                                        <div className="flex items-center gap-2 mb-4">
                                            <AlertTriangle className="w-5 h-5 text-orange-400" />
                                            <h3 className="text-white font-semibold">Raw TomTom Response</h3>
                                        </div>
                                        <div className="bg-black rounded-lg p-4 overflow-auto max-h-60 border border-gray-800">
                                            <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                                                {JSON.stringify(prediction.real_time_validation.raw_data, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-gray-900/30 rounded-xl border border-dashed border-gray-700 text-gray-500 p-12">
                                <Navigation className="w-12 h-12 mb-4 opacity-50" />
                                <p>Enter route details and simulate delivery to validate model accuracy.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OverallPage;