/////////////////////////////////////////////////////////////////////////
// Vertex shader for lighting
//
// Copyright 2013 DigiPen Institute of Technology
////////////////////////////////////////////////////////////////////////
#version 330

uniform mat4 WorldView, WorldInverse, WorldProj, ModelTr, NormalTr;

in vec4 vertex;
in vec3 vertexNormal;
in vec2 vertexTexture;
in vec3 vertexTangent;

out vec3 normalVec, lightVec, eyeVec;
out vec2 texCoord;
out vec3 tanVec;
uniform vec3 lightPos;

void main()
{      
    gl_Position = WorldProj*WorldView*ModelTr*vertex;
    
    vec3 worldPos = (ModelTr*vertex).xyz;

    normalVec = vertexNormal*mat3(NormalTr); 
    lightVec = lightPos - worldPos;

    vec3 eyePos = (WorldInverse*vec4(0,0,0,1)).xyz;
    lightVec = lightPos - worldPos;
    eyeVec = eyePos - worldPos;

    texCoord = vertexTexture; 
    tanVec = mat3(ModelTr) * vertexTangent;
}
