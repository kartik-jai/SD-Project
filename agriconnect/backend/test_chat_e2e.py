import os
import sys

HERE = os.path.dirname(__file__)
sys.path.insert(0, HERE)
import app
import db

def run_tests():
    db.init_db()
    client = app.app.test_client()

    # 1. Register test users
    client.post('/api/register', json={'name':'E2E Farmer 1','phone':'9888800001','password':'password123','role':'Farmer'})
    client.post('/api/register', json={'name':'E2E Farmer 2','phone':'9888800003','password':'password123','role':'Farmer'})
    client.post('/api/register', json={'name':'E2E Buyer 1','phone':'9888800002','password':'password123','role':'Buyer'})
    client.post('/api/register', json={'name':'E2E Buyer 2','phone':'9888800004','password':'password123','role':'Buyer'})

    t_farmer1 = client.post('/api/login', json={'phone':'9888800001','password':'password123'}).get_json()['token']
    t_farmer2 = client.post('/api/login', json={'phone':'9888800003','password':'password123'}).get_json()['token']
    t_buyer1 = client.post('/api/login', json={'phone':'9888800002','password':'password123'}).get_json()['token']
    t_buyer2 = client.post('/api/login', json={'phone':'9888800004','password':'password123'}).get_json()['token']

    u_farmer1 = client.get('/api/me', headers={'Authorization': 'Bearer ' + t_farmer1}).get_json()
    u_farmer2 = client.get('/api/me', headers={'Authorization': 'Bearer ' + t_farmer2}).get_json()
    u_buyer1 = client.get('/api/me', headers={'Authorization': 'Bearer ' + t_buyer1}).get_json()
    u_buyer2 = client.get('/api/me', headers={'Authorization': 'Bearer ' + t_buyer2}).get_json()

    # 2. Prevent self-chat
    self_chat = client.post('/api/conversations', headers={'Authorization': 'Bearer ' + t_farmer1}, json={'recipient_id': u_farmer1['id']})
    assert self_chat.status_code == 400, 'Self chat should fail'
    print('Pass: Self chat prevented')

    # 3. Prevent Farmer <-> Farmer chat
    farmer_farmer = client.post('/api/conversations', headers={'Authorization': 'Bearer ' + t_farmer1}, json={'recipient_id': u_farmer2['id']})
    assert farmer_farmer.status_code == 400, 'Farmer-Farmer chat should fail'
    print('Pass: Farmer-Farmer chat prevented')

    # 4. Prevent Buyer <-> Buyer chat
    buyer_buyer = client.post('/api/conversations', headers={'Authorization': 'Bearer ' + t_buyer1}, json={'recipient_id': u_buyer2['id']})
    assert buyer_buyer.status_code == 400, 'Buyer-Buyer chat should fail'
    print('Pass: Buyer-Buyer chat prevented')

    # 5. Farmer creates lot
    lot = client.post('/api/lots', headers={'Authorization': 'Bearer ' + t_farmer1}, json={'crop':'Wheat','quantity':'100 Quintals','quality':'A','location':'Ludhiana','price_per_kg':32}).get_json()
    lot_id = lot['id']

    # 6. Buyer initiates conversation for this lot (Buyer <-> Farmer)
    conv = client.post('/api/conversations', headers={'Authorization': 'Bearer ' + t_buyer1}, json={'recipient_id': u_farmer1['id'], 'item_type': 'lot', 'item_id': lot_id}).get_json()
    conv_id = conv['id']
    print('Pass: Cross-role Conversation initiated:', conv_id)

    # 7. Buyer makes a price negotiation offer
    msg1 = client.post(f'/api/conversations/{conv_id}/messages', headers={'Authorization': 'Bearer ' + t_buyer1}, json={'text': 'Can we close at 29.5?', 'offer_price': 29.5}).get_json()
    assert msg1['offer_price'] == 29.5
    assert msg1['offer_status'] == 'pending'
    print('Pass: Offer message posted:', msg1['id'])

    # 8. Check unread count for farmer
    unread = client.get('/api/conversations/unread-count', headers={'Authorization': 'Bearer ' + t_farmer1}).get_json()
    assert unread['unread_count'] >= 1
    print('Pass: Unread count for farmer:', unread['unread_count'])

    # 9. Farmer opens conversation -> unread messages become read
    conv_view = client.get(f'/api/conversations/{conv_id}', headers={'Authorization': 'Bearer ' + t_farmer1}).get_json()
    assert len(conv_view['messages']) >= 1
    unread_after = client.get('/api/conversations/unread-count', headers={'Authorization': 'Bearer ' + t_farmer1}).get_json()
    assert unread_after['unread_count'] == 0
    print('Pass: Messages marked read on view')

    # 10. Buyer cannot accept own offer
    bad_accept = client.post(f'/api/messages/{msg1["id"]}/offer', headers={'Authorization': 'Bearer ' + t_buyer1}, json={'status': 'accepted'})
    assert bad_accept.status_code == 400
    print('Pass: Cannot accept own offer')

    # 11. Farmer accepts the offer
    accept_res = client.post(f'/api/messages/{msg1["id"]}/offer', headers={'Authorization': 'Bearer ' + t_farmer1}, json={'status': 'accepted'})
    assert accept_res.status_code == 200
    assert accept_res.get_json()['offer_status'] == 'accepted'
    print('Pass: Offer accepted by farmer')

    # 12. Farmer sends a reply message
    reply_res = client.post(f'/api/conversations/{conv_id}/messages', headers={'Authorization': 'Bearer ' + t_farmer1}, json={'text': 'Deal done at 29.5! When will you send the truck?'})
    assert reply_res.status_code == 201
    print('Pass: Farmer sent reply')

    # 13. Farmer cannot pay (only Buyer pays)
    farmer_bad_pay = client.post(f'/api/conversations/{conv_id}/pay', headers={'Authorization': 'Bearer ' + t_farmer1}, json={'agreed_price_per_kg': 29.5, 'quantity': '100 Quintals', 'quantity_kg': 10000, 'payment_type': 'advance'})
    assert farmer_bad_pay.status_code == 403, 'Farmer pay should be forbidden'
    print('Pass: Farmer cannot initiate payment (Buyer only)')

    # 14. Buyer confirms offer and pays 20% advance token
    pay_res = client.post(f'/api/conversations/{conv_id}/pay', headers={'Authorization': 'Bearer ' + t_buyer1}, json={
        'message_id': msg1['id'],
        'agreed_price_per_kg': 29.5,
        'quantity': '100 Quintals',
        'quantity_kg': 10000,
        'payment_type': 'advance',
        'payment_method': 'upi'
    })
    assert pay_res.status_code == 201
    deal = pay_res.get_json()['deal']
    assert deal['total_amount'] == 295000.0 # 10,000 kg * 29.5
    assert deal['paid_amount'] == 59000.0 # 20% of 295,000
    assert deal['payment_type'] == 'advance'
    assert deal['status'] == 'paid'
    deal_id = deal['id']
    print('Pass: Deal created and payment confirmed:', deal['payment_id'], 'Paid:', deal['paid_amount'])

    # 15. Verify deal confirmation message added to chat
    conv_after_pay = client.get(f'/api/conversations/{conv_id}', headers={'Authorization': 'Bearer ' + t_buyer1}).get_json()
    assert len(conv_after_pay['deals']) >= 1
    assert any('Deal Confirmed' in m['text'] for m in conv_after_pay['messages'])
    print('Pass: Deal message present in chat')

    # 16. Verify deal receipt API
    receipt = client.get(f'/api/deals/{deal_id}', headers={'Authorization': 'Bearer ' + t_farmer1}).get_json()
    assert receipt['payment_id'] == deal['payment_id']
    assert receipt['buyer']['name'] == 'E2E Buyer 1'
    assert receipt['farmer']['name'] == 'E2E Farmer 1'
    print('Pass: Deal receipt API verified')

    # 17. Buyer creates a demand for Wheat
    dem = client.post('/api/demand', headers={'Authorization': 'Bearer ' + t_buyer1}, json={'crop':'Wheat','quantity':'100 Quintals','quality':'A','location':'Ludhiana','price_per_kg':30}).get_json()
    dem_id = dem['id']

    # Verify both lot and demand are visible in marketplace before delivery
    all_lots_before = client.get('/api/lots/all', headers={'Authorization': 'Bearer ' + t_buyer1}).get_json()
    all_dem_before = client.get('/api/demand/all', headers={'Authorization': 'Bearer ' + t_farmer1}).get_json()
    assert any(l['id'] == lot_id for l in all_lots_before), 'Lot must be visible before delivery'
    assert any(d['id'] == dem_id for d in all_dem_before), 'Demand must be visible before delivery'

    # 18. Buyer confirms lot received
    deliv_res = client.post(f'/api/conversations/{conv_id}/confirm-delivery', headers={'Authorization': 'Bearer ' + t_buyer1})
    assert deliv_res.status_code == 200, f'Delivery confirmation failed: {deliv_res.data}'
    delivered_deal = deliv_res.get_json()['deal']
    assert delivered_deal['status'] == 'delivered'
    print('Pass: Delivery confirmed by buyer, deal status: delivered')

    # 19. Verify satisfying lot and satisfied demand have vanished from dashboard
    all_lots_after = client.get('/api/lots/all', headers={'Authorization': 'Bearer ' + t_buyer1}).get_json()
    all_dem_after = client.get('/api/demand/all', headers={'Authorization': 'Bearer ' + t_farmer1}).get_json()
    assert not any(l['id'] == lot_id for l in all_lots_after), 'Satisfying lot must vanish from /api/lots/all'
    assert not any(d['id'] == dem_id for d in all_dem_after), 'Satisfied demand must vanish from /api/demand/all'
    print('Pass: Both satisfied demand and satisfying lot vanished from marketplace dashboard')

    # 20. Clean up test records
    with db.conn() as c:
        c.execute('DELETE FROM deals WHERE conversation_id=?', (conv_id,))
        c.execute('DELETE FROM messages WHERE conversation_id=?', (conv_id,))
        c.execute('DELETE FROM conversations WHERE id=?', (conv_id,))
        c.execute('DELETE FROM lots WHERE id=?', (lot_id,))
        c.execute('DELETE FROM demand WHERE id=?', (dem_id,))
        c.execute('DELETE FROM users WHERE phone IN (?, ?, ?, ?)', ('9888800001', '9888800002', '9888800003', '9888800004'))
        c.commit()
    print('All e2e chat, payment, delivery & vanish tests passed successfully!')

if __name__ == '__main__':
    run_tests()

