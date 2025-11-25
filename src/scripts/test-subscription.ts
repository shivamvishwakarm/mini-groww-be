import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

console.log('⏳ Connecting to WebSocket...\n');

socket.on('connect', () => {
    console.log('✅ Connected to WebSocket server!');
    console.log(`🆔 Socket ID: ${socket.id}\n`);

    // Subscribe to AAPL and GOOGL
    console.log('📊 Subscribing to AAPL and GOOGL...');
    socket.emit('subscribe', { symbols: ['AAPL', 'GOOGL'] });
});

socket.on('subscribed', (data) => {
    console.log('✅ Subscription confirmed:', data.symbols);
    console.log('⏳ Waiting for price history and live updates...\n');
});

socket.on('priceHistory', (data) => {
    console.log(`📜 Price History for ${data.symbol}:`);
    console.log(`   Total data points: ${data.history.length}`);
    if (data.history.length > 0) {
        console.log(`   Latest:`, data.history[0]);
        console.log(`   Oldest:`, data.history[data.history.length - 1]);
    }
    console.log('');
});

let updateCount = 0;
socket.on('priceUpdate', (data) => {
    updateCount++;
    console.log(`📈 Live Update #${updateCount}:`, {
        symbol: data.symbol,
        price: data.price,
        change: `${data.changePercent.toFixed(2)}%`,
        timestamp: data.timestamp,
    });

    // After receiving 5 updates, unsubscribe from GOOGL
    if (updateCount === 5) {
        console.log('\n🔄 Unsubscribing from GOOGL...');
        socket.emit('unsubscribe', { symbols: ['GOOGL'] });
    }

    // After 10 updates, disconnect
    if (updateCount === 10) {
        console.log('\n✅ Test complete! Disconnecting...');
        socket.disconnect();
        process.exit(0);
    }
});

socket.on('unsubscribed', (data) => {
    console.log('✅ Unsubscribed from:', data.symbols);
    console.log('   (Should only receive AAPL updates now)\n');
});

socket.on('error', (data) => {
    console.error('❌ Error:', data.message);
});

socket.on('connect_error', (err) => {
    console.error('❌ Connection Error:', err.message);
    process.exit(1);
});

// Timeout if test takes too long
setTimeout(() => {
    console.error('⏰ Timeout: Test took too long');
    process.exit(1);
}, 30000);
