# 🚀 AI Visual Page Builder
**Build, Animate, and Publish** professional sites with **Google Gemini AI**.
- ⚡ AI Generation | 🎨 Tailwind Styles | 🎬 Motion Effects | 🔌 WP Bridge
## 🔌 WordPress Production Bridge
1. Create `/wp-content/plugins/ai-bridge.php`:
```php
<?php add_action('rest_api_init',function(){register_rest_route('ai-builder/v1','/publish',['methods'=>'POST','callback'=>function($r){$p=$r->get_json_params();$id=wp_insert_post(['post_title'=>$p['title']??'AI Page','post_content'=>$p['content']??'','post_status'=>'publish','post_type'=>'page']);return['success'=>true,'url'=>get_permalink($id)];},'permission_callback'=>function(){return current_user_can('edit_posts');}]);}); add_action('wp_head',function(){echo'<script src="https://cdn.tailwindcss.com"></script>';});?>
```
2. Activate plugin and use **Application Password** in settings.
**Unleash your creativity. Built for the modern web.**
