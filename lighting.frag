/////////////////////////////////////////////////////////////////////////
// Pixel shader for lighting
////////////////////////////////////////////////////////////////////////
#version 330

out vec4 FragColor;

// These definitions agree with the ObjectIds enum in scene.h
const int     nullId	= 0;
const int     skyId	= 1;
const int     seaId	= 2;
const int     groundId	= 3;
const int     roomId	= 4;
const int     boxId	= 5;
const int     frameId	= 6;
const int     lPicId	= 7;
const int     rPicId	= 8;
const int     teapotId	= 9;
const int     spheresId	= 10;
const int     floorId	= 11;

in vec3 normalVec, lightVec, eyeVec;
in vec2 texCoord;
in vec3 tanVec;
const float PI = 3.14159f;
uniform sampler2D tex, normalTex;

uniform int objectId;
uniform vec3 diffuse, specular, Light, Ambient;
uniform float shininess;

void main()
{
    vec3 N = normalize(normalVec);
    vec3 L = normalize(lightVec);
    vec3 V = normalize(eyeVec);
    vec3 H = normalize(L+V);

    vec3 T = normalize(tanVec);
    vec3 B = normalize(cross(T, N));

    vec3 Kd = diffuse; 
    vec3 Ks = specular;  
    vec3 Ia = Ambient;

    float alpha = shininess;
    vec2 uv;

    if(objectId == groundId)
    {
        uv = texCoord * 50;
        Kd = texture(tex, uv).xyz;
    }
    if(objectId == roomId)
    {
        uv = texCoord.yx * 20;

        vec3 delta = texture(normalTex, uv).xyz;
        delta = delta * 2 - vec3(1,1,1);
        N = delta.x * T + delta.y * B + delta.z * N;
        Kd = texture(tex, uv).xyz;
    }
    if(objectId == skyId)
    {
        uv = vec2(-atan(V.y, V.x)/(2*3.14), acos(V.z)/3.14);

        if(uv.y < 0.5)
        {
            uv.y = 0.5;
        }
        FragColor.xyz = texture(tex, uv).xyz;
        return;
    }

    if(objectId == seaId)
    {
        uv = texCoord * 200;

        vec3 delta = texture(normalTex, uv).xyz;
        delta = delta * 2 - vec3(1, 1, 1);
        N = delta.x * T + delta.y * B + delta.z * N;
        
        vec3 R = -2*(dot(V,N)*N) + V;

        uv = vec2(-atan(R.y, R.x)/(2*PI), acos(R.z)/PI);

        FragColor.xyz = texture(tex, uv).xyz;
        return;
    }

    if(objectId == teapotId)
    {   
        uv = texCoord;
        Kd = texture(tex, uv).xyz;
    }
    if(objectId == boxId || objectId == floorId)
    {
        uv = texCoord;
        
        vec3 delta = texture(normalTex, uv).xyz;
        delta = delta * 2 - vec3(1, 1, 1);
        N = delta.x * T + delta.y * B + delta.z * N;
        
        Kd = texture(tex, uv).xyz;
    }

    if(objectId == rPicId)
    {
       if (texCoord.x < 0.05f || texCoord.x > 0.95f) {
            Kd = vec3(0.4f, 0.4f, 0.4f);
        }
        else if (texCoord.y < 0.05f || texCoord.y > 0.95f) {
            Kd = vec3(0.4f, 0.4f, 0.4f);
        }
        else {
            Kd = texture(tex, (texCoord - 0.05f) / 0.9).xyz;
        }
    }
    if(objectId == lPicId)
    {
        ivec2 uv = ivec2(10*texCoord);
        if ((uv[0]+uv[1])%2==0)
           Kd = vec3(1.0, 1.0, 1.0);
        else
           Kd = vec3(0.0, 0.0, 0.0);
    }

    
    float LN = max(dot(L,N), 0.0);
    float HN = max(dot(H,N), 0.0);
    float LH = max(dot(L,H), 0.0);

    vec3 F = Ks + ((vec3(1,1,1) - Ks) * pow((1-LH), 5));
    float G = 1 / (pow(LH, 2));
    float D = ((alpha + 2) / (2 * 3.14159f)) * pow(HN, alpha);

    vec3 BRDF = (Kd / PI) + ((F * G * D) / 4);

    FragColor.xyz = Ia * Kd + Light * (LN) * BRDF;
}
