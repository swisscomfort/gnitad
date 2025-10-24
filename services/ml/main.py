"""
API Server für ML-Services

Exponiert Character Generator und Object Recognition als REST API
"""

from flask import Flask, request, jsonify
from config import Config
from logger import logger
from character_generator import get_character_generator
from object_recognition import get_object_recognizer

app = Flask(__name__)

# Initialize services
character_gen = get_character_generator()
object_recognizer = get_object_recognizer()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'service': 'ml',
        'version': '1.0.0'
    })

@app.route('/api/v1/character/generate', methods=['POST'])
def generate_character():
    """Generate character profile from decisions"""
    try:
        data = request.json
        decisions = data.get('decisions', {})
        
        if not decisions:
            return jsonify({'error': 'Decisions required'}), 400
        
        character = character_gen.generate_character(decisions)
        
        return jsonify({
            'status': 'success',
            'data': character
        }), 200
    except Exception as e:
        logger.error(f'Error in generate_character: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/photo/recognize', methods=['POST'])
def recognize_objects():
    """Recognize objects in photo"""
    try:
        data = request.json
        image_data = data.get('image_data')
        
        if not image_data:
            return jsonify({'error': 'Image data required'}), 400
        
        result = object_recognizer.recognize_objects(image_data)
        
        return jsonify({
            'status': 'success',
            'data': result
        }), 200
    except Exception as e:
        logger.error(f'Error in recognize_objects: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/photo/validate', methods=['POST'])
def validate_photo():
    """Validate photo quality and safety"""
    try:
        data = request.json
        image_data = data.get('image_data')
        
        if not image_data:
            return jsonify({'error': 'Image data required'}), 400
        
        validation = object_recognizer.validate_photo(image_data)
        
        return jsonify({
            'status': 'success',
            'data': validation
        }), 200
    except Exception as e:
        logger.error(f'Error in validate_photo: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f'Internal error: {str(error)}')
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info(f'Starting ML API Server (ENV: {Config.ENV})')
    app.run(
        host='0.0.0.0',
        port=3002,
        debug=Config.DEBUG
    )
